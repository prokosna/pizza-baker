package actors

import akka.actor.{Actor, ActorRef, Address, Props, RelativeActorPath}
import akka.cluster.{Cluster, Member, MemberStatus}
import akka.cluster.ClusterEvent.{ReachableMember, UnreachableMember, _}
import messages.NodeStateUpdated

/**
  * Created by prokosna on 16/07/11.
  */
object StateMonitorClient{
  def props(user: ActorRef) = Props(classOf[StateMonitorClient], user)
}

class StateMonitorClient(user: ActorRef) extends Actor {
  val cluster = Cluster(context.system)

  override def preStart(): Unit = {
    cluster.subscribe(self, initialStateMode = InitialStateAsEvents, classOf[MemberEvent], classOf[ReachableMember], classOf[UnreachableMember])
  }

  override def postStop(): Unit = {
    cluster.unsubscribe(self)
  }

  override def receive: Receive = {
    case state: CurrentClusterState => state.members.foreach(m => sendNodeStateUpdate(m))
    case memberEvent: MemberEvent => sendNodeStateUpdate(memberEvent.member)
    case reachableEvent: ReachableMember => sendNodeStateUpdate(reachableEvent.member, Some("Reachable"))
    case unreachableEvent: UnreachableMember => sendNodeStateUpdate(unreachableEvent.member, Some("Unreachable"))
  }

  private def sendNodeStateUpdate(member: Member, reachable: Option[String] = None) ={
    user ! NodeStateUpdated(member.address.toString, member.roles, reachable.getOrElse(member.status.toString))
  }

}
