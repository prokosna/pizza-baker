package messages

import akka.actor.ActorRef
import play.api.libs.json.Json

/**
  * Created by prokosna on 16/07/12.
  */
// Pizza types
sealed trait Pizza

case object PiPizza extends Pizza

case object FactorialPizza extends Pizza

case object TakeuchiPizza extends Pizza

// Pizza client-service messages
final case class PizzaCustomerOrder(pizzaType: Pizza)

final case class PizzaCustomerBaked(pizzaType: Pizza)

final case class PizzaCustomerStop(pizzaType: Pizza)

final case class PizzaCustomerEnd(customer: ActorRef)

case object PizzaCustomerPing

case object PizzaCustomerPong

// Pizza service-worker messages
case object ChefReady

case object NoOrder

final case class PizzaChefOrder(customer: ActorRef, pizzaType: Pizza)

final case class PizzaChefBaked(customer: ActorRef, pizzaType: Pizza)

// Pizza client-monitor messages
final case class NodeStateUpdated(address: String, roles: Set[String], status: String)

object NodeStateUpdated {
  implicit val reads = Json.reads[NodeStateUpdated]
  implicit val writes = Json.writes[NodeStateUpdated]
}