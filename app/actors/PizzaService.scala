package actors

import akka.actor.Actor.Receive
import akka.pattern.ask
import akka.actor.{Actor, ActorRef, Props}
import akka.cluster.routing.{ClusterRouterPool, ClusterRouterPoolSettings}
import akka.routing.{BroadcastPool, ConsistentHashingPool}
import akka.util.Timeout
import messages._

import scala.util.{Random, Success}

/**
  * Created by prokosna on 16/07/12.
  */
final case class Customer(customer: ActorRef, pizzaType: Pizza)

class PizzaService extends Actor {
  // scheduled message
  case object CheckCustomersExist

  // for scheduler
  import scala.concurrent.duration._

  val system = context.system

  import system.dispatcher

  // reply timeout
  implicit val timeout = Timeout(3 seconds)

  // create router
  val chefRouter = context.actorOf(new ClusterRouterPool(
    new BroadcastPool(3),
    new ClusterRouterPoolSettings(
      totalInstances = 100,
      maxInstancesPerNode = 1,
      allowLocalRoutees = true,
      useRole = "chef"
    ))
    .props(Props(classOf[PizzaChef], "/user/pizzaServiceProxy")), "chefRouter")

  var customers: Set[Customer] = Set.empty

  override def preStart(): Unit = {
    system.scheduler.schedule(3 seconds, 3 seconds, self, CheckCustomersExist)
  }

  override def receive: Receive = {
    case order: PizzaCustomerOrder => {
      println(s"I'm PizzaService. I got order from ${sender.path}")
      customers += Customer(sender, order.pizzaType)
    }
    case stop: PizzaCustomerStop => {
      println(s"I'm PizzaService. I got STOP order from ${sender.path}")
      customers = customers.filter(c => c.customer != sender && c.pizzaType != stop.pizzaType)
    }
    case end: PizzaCustomerEnd => {
      println(s"I'm PizzaService. ${end.customer.path} has gone away. Bye!")
      customers = customers.filter(c => c.customer != end.customer)
    }
    case ChefReady => {
      assignNewOrderToChef(sender)
    }
    case baked: PizzaChefBaked => {
      // tell customer that pizza has been baked
      baked.customer ! PizzaCustomerBaked(baked.pizzaType)
      // assign new pizza work randomly
      assignNewOrderToChef(sender)
    }
    case CheckCustomersExist => checkCustomersExist()
  }

  private def assignNewOrderToChef(chef: ActorRef): Unit = {
    if (customers.nonEmpty) {
      val order = customers.toVector(Random.nextInt(customers.size))
      chef ! PizzaChefOrder(order.customer, order.pizzaType)
    } else {
      chef ! NoOrder
    }
  }

  private def checkCustomersExist() = {
    customers.foreach(c => {
      val f = c.customer ? PizzaCustomerPing
      f.onFailure {
        case _ => self ! PizzaCustomerEnd(c.customer)
      }
    })
  }
}
