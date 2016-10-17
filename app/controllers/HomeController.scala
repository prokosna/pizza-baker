package controllers

import javax.inject._

import actors.UserSocket
import akka.actor.ActorSystem
import akka.stream.Materializer
import play.api.libs.json.JsValue
import play.api.libs.streams.ActorFlow
import play.api.mvc._

import scala.concurrent.Future

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(implicit system: ActorSystem, materializer: Materializer) extends Controller {
  val USER_ID = "user_id"

  def index = Action {
    Ok(views.html.index())
  }

  /**
    * WebSocket entry.
    *
    * @return WebSocket
    */
  def socket = WebSocket.accept[JsValue, JsValue] { implicit request =>
    ActorFlow.actorRef(out => UserSocket.props("test_user")(out))
    //Future.successful(request.session.get(USER_ID) match {
    //  case None => Left(Forbidden)
    //  case Some(uid) => Right(ActorFlow.actorRef(out => UserSocket.props("user")(out)))
    //})
  }
}
