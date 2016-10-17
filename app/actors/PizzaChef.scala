package actors

import akka.actor.{Actor, ActorSystem}
import akka.actor.Actor.Receive
import messages._

/**
  * Created by prokosna on 16/07/12.
  */
class PizzaChef(servicePathProxy: String) extends Actor {

  import scala.concurrent.duration._

  val system = context.system

  import system.dispatcher

  val master = context.actorSelection(servicePathProxy)

  override def preStart(): Unit = {
    println(s"Hi, I'm Chef at [${self.path}]. I'm ready and request work to my parent [${context.parent.path}]!")
    master ! ChefReady
  }

  override def postRestart(reason: Throwable): Unit = {
    preStart()
  }

  override def receive: Receive = {
    case order: PizzaChefOrder => {
      println(s"Hey, I'm Chef at [${self.path}]. I got order from ${order.customer.path}!")
      order.pizzaType match {
        case PiPizza => {
          println(s"I begin to bake Pizza! [${self.path}]")
          bakePiPizza()
          println(s"I finished to bake Pizza for ${order.customer.path}! Enjoy! [${self.path}]")
        }
        case TakeuchiPizza => {
          println(s"I start to bake TakeuchiPizza! [${self.path}]")
          bakeTakeuchiPizza()
          println(s"I finished to bake TakeuchiPizza for ${order.customer.path}! Enjoy! [${self.path}]")

        }
        case FactorialPizza => {
          println(s"I start to bake FactorialPizza! [${self.path}]")
          bakeFactorialPizza()
          println(s"I finished to bake FactorialPizza for ${order.customer.path}! Enjoy! [${self.path}]")
        }
      }
      sender ! PizzaChefBaked(order.customer, order.pizzaType)
    }
    case NoOrder => {
      // There is no order. Sleep and request again!
      println(s"I'm Chef at [${self.path}], but I have no work.")
      system.scheduler.scheduleOnce(3 seconds, sender(), ChefReady)
    }
  }

  private def bakePiPizza() = {
    var d: Double = 0.0
    for (i <- 0 to 15000000) {
      d = d + i
    }
    println(d);
  }

  private def bakeTakeuchiPizza() = {

  }

  private def bakeFactorialPizza() = {

  }
}
