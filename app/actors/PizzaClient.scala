package actors

import akka.actor.{Actor, ActorRef, ActorSelection, Address, Props, RelativeActorPath, RootActorPath}
import akka.actor.Actor.Receive
import akka.cluster.Cluster
import akka.cluster.ClusterEvent._
import messages._

import scala.concurrent.forkjoin.ThreadLocalRandom

/**
  * Created by prokosna on 16/07/11.
  */
object PizzaClient {
  def props(servicePath: String)(user: ActorRef) = Props(classOf[PizzaClient], servicePath, user)
}

class PizzaClient(servicePath: String, user: ActorRef) extends Actor {
  val cluster = Cluster(context.system)
  var nodes = Set.empty[Address]
  val servicePathElements = servicePath match {
    case RelativeActorPath(elements) => elements
    case _ => throw new IllegalArgumentException("servicePath [%s] is not a valid relative actor path" format servicePath)
  }

  override def preStart(): Unit = {
    cluster.subscribe(self, initialStateMode = InitialStateAsEvents, classOf[MemberEvent], classOf[ReachabilityEvent])
  }

  override def postStop(): Unit = {
    cluster.unsubscribe(self)
  }

  override def receive: Receive = {
    case order: PizzaCustomerOrder => {
      // find service actor
      val service = findServiceActor()
      service ! order
    }
    case stop: PizzaCustomerStop => {
      // find service actor
      val service = findServiceActor()
      service ! stop
    }
    case result: PizzaCustomerBaked => {
      user ! result
    }
    case PizzaCustomerPing => sender() ! PizzaCustomerPong
    case MemberUp(m) if m.hasRole("chef") => nodes += m.address
    case ReachableMember(m) if m.hasRole("chef") => nodes += m.address
    case otherMemberEvent: MemberEvent => nodes -= otherMemberEvent.member.address
    case UnreachableMember(m) => nodes -= m.address
  }

  private def findServiceActor(): ActorSelection = {
    // for load balance, select random master proxy
    val address = nodes.toIndexedSeq(ThreadLocalRandom.current.nextInt(nodes.size))
    context.actorSelection(RootActorPath(address) / servicePathElements)
  }
}
