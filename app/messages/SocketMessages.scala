package messages

import play.api.libs.json._

/**
  * Created by prokosna on 16/06/26.
  */
case class SocketReqMessage(method: String, params: Option[JsValue], id: Option[Int])

object SocketReqMessage {
  implicit lazy val writes = new Writes[SocketReqMessage] {
    def writes(socketReqMessage: SocketReqMessage): JsValue = {
      Json.obj(
        "type" -> "request",
        "method" -> socketReqMessage.method,
        "params" -> socketReqMessage.params,
        "id" -> socketReqMessage.id
      )
    }
  }
  implicit lazy val reads: Reads[SocketReqMessage] = new Reads[SocketReqMessage] {
    def reads(jsValue: JsValue) = {
      val method = (jsValue \ "method").as[String]
      val params = (jsValue \ "params").asOpt[JsValue]
      val id = (jsValue \ "id").asOpt[Int]
      JsSuccess(SocketReqMessage(method, params, id))
    }
  }
}

case class SocketResMessage(method: String, errorOrResult: Either[JsValue, JsValue], id: Option[Int])

object SocketResMessage {
  implicit lazy val writes = new Writes[SocketResMessage] {
    def writes(socketResMessage: SocketResMessage): JsValue = {
      Json.obj(
        "type" -> "response",
        "method" -> socketResMessage.method,
        socketResMessage.errorOrResult.fold(
          error => "error" -> error,
          result => "result" -> result
        ),
        "id" -> socketResMessage.id
      )
    }
  }

  implicit lazy val reads = new Reads[SocketResMessage] {
    def reads(jsValue: JsValue) = {
      val method = (jsValue \ "method").as[String]
      val errorOrResult = (jsValue \ "result").toEither.fold(
        error => Left((jsValue \ "error").as[JsValue]),
        result => Right(result.as[JsValue])
      )
      val id = (jsValue \ "id").asOpt[Int]
      JsSuccess(SocketResMessage(method, errorOrResult, id))
    }
  }
}