package actors

import akka.actor.SupervisorStrategy.Restart
import akka.actor.{Actor, ActorLogging, Props, _}
import akka.event.LoggingReceive
import messages._
import play.api.data.validation.ValidationError
import play.api.libs.json._

/**
  * Created by prokosna on 16/06/19.
  */
object UserSocket {
  def props(user: String)(out: ActorRef) = Props(classOf[UserSocket], user, out)
}

class UserSocket(user: String, out: ActorRef) extends Actor with ActorLogging {

  import UserSocket._

  override val supervisorStrategy = OneForOneStrategy() {
    case _ => Restart
  }

  // generate my PizzaClient
  val pizzaClient = context.actorOf(PizzaClient.props("/user/pizzaServiceProxy")(self), s"pizzaClient_$user")
  // generate my StateMonitor
  val stateMonitor = context.actorOf(StateMonitorClient.props(self), s"stateMonitor_$user")

  override def postStop(): Unit = {
    pizzaClient ! PizzaCustomerEnd
  }

  def receive = LoggingReceive {
    case js: JsValue => (js \ "type").as[String] match {
      case "request" => Json.fromJson[SocketReqMessage](js).fold(
        invalid => println("Invalid request message"),
        valid => self ! valid
      )
      case "response" => Json.fromJson[SocketResMessage](js).fold(
        invalid => println("Invalid response message"),
        valid => self ! valid
      )
      case _ => println("no type match.")
    }
    case req: SocketReqMessage => dealRequest(req)
    case res: SocketResMessage => dealResponse(res)
    case result: PizzaCustomerBaked => {
      out ! Json.toJson[SocketReqMessage](
        SocketReqMessage("pizzaBaked", Some(JsString(result.pizzaType.toString)), None)
      )
    }
    case stateUpdated: NodeStateUpdated => nodeStateUpdated(stateUpdated)
    case _ =>
  }

  private def dealRequest(req: SocketReqMessage) {
    println("dealRequest: " + req.toString);
    req.method match {
      case "orderPizza" => orderPizza(req.params, req.id)
      case "orderStop" => orderStop(req.params, req.id)
    }
  }

  private def dealResponse(res: SocketResMessage): Unit = {
    res.method match {
      case _ => // nothing to do
    }
  }

  private def orderPizza(params: Option[JsValue], reqId: Option[Int]) = {
    val orderAccepted = () => {
      out ! Json.toJson(SocketResMessage("orderAccepted", Right(JsBoolean(true)), reqId))
    }
    val orderError = (message: String) => {
      out ! Json.toJson(SocketResMessage("orderError", Left(JsString(message)), reqId))
    }
    params.map(jsValue =>
      (jsValue \ "type").asOpt[String] match {
        case Some("PiPizza") => {
          pizzaClient ! PizzaCustomerOrder(PiPizza)
          orderAccepted
        }
        case Some("FactorialPizza") => {
          pizzaClient ! PizzaCustomerOrder(FactorialPizza)
          orderAccepted
        }
        case Some("TakeuchiPizza") => {
          pizzaClient ! PizzaCustomerOrder(TakeuchiPizza)
          orderAccepted
        }
        case Some(_) => orderError(s"""There is no suitable 'type' with 'OrderPizza'""")
        case None => orderError("""param 'type' is necessary with 'OrderPizza'""")
      }
    ).getOrElse(orderError("""param 'type' is necessary with 'OrderPizza'"""))
  }

  private def orderStop(params: Option[JsValue], reqId: Option[Int]) = {
    val stopAccepted = () => {
      out ! Json.toJson(SocketResMessage("stopAccepted", Right(JsBoolean(true)), reqId))
    }
    val stopError = (message: String) => {
      out ! Json.toJson(SocketResMessage("stopError", Left(JsString(message)), reqId))
    }
    params.map(jsValue =>
      (jsValue \ "type").asOpt[String] match {
        case Some("PiPizza") => {
          pizzaClient ! PizzaCustomerStop(PiPizza)
          stopAccepted
        }
        case Some("FactorialPizza") => {
          pizzaClient ! PizzaCustomerStop(FactorialPizza)
          stopAccepted
        }
        case Some("TakeuchiPizza") => {
          pizzaClient ! PizzaCustomerStop(TakeuchiPizza)
          stopAccepted
        }
        case Some(_) => stopError(s"""There is no suitable 'type' with 'OrderStop'""")
        case None => stopError("""param 'type' is necessary with 'OrderStop'.""")
      }
    ).getOrElse(stopError("""param 'type' is necessary with 'OrderStop'."""))
  }

  private def nodeStateUpdated(stateUpdated: NodeStateUpdated) ={
    println("nodeStateUpdate: " + Json.toJson(stateUpdated))
    println(Json.toJson(SocketReqMessage("nodeStateUpdated", Some(Json.toJson(stateUpdated)), None)))
    out ! Json.toJson(
      SocketReqMessage("nodeStateUpdated",
        Some(Json.toJson(stateUpdated)),
        None)
    )
  }
}
