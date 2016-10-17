package actors

import akka.actor.{ActorSystem, PoisonPill, Props}
import akka.cluster.singleton.{ClusterSingletonManager, ClusterSingletonManagerSettings, ClusterSingletonProxy, ClusterSingletonProxySettings}
import com.typesafe.config.ConfigFactory

/**
  * Created by prokosna on 16/07/12.
  */
object PizzaMain {
  def main(args: Array[String]) {
    if (args.isEmpty)
      println("run <host> <port>")
    else
      startup(args(0), args(1))
  }

  def startup(host: String, port: String): Unit = {
    // override configuration
    val config = ConfigFactory.parseString(s"akka.remote.netty.tcp.port = ${port}")
      .withFallback(ConfigFactory.parseString(s"akka.remote.netty.tcp.hostname = ${host}"))
     // .withFallback(ConfigFactory.parseString(s"akka.remote.netty.tcp.bind-hostname = ${host}"))
      .withFallback(ConfigFactory.parseString(s"akka.remote.netty.tcp.bind-port = ${port}"))
      .withFallback(ConfigFactory.parseString("akka.cluster.roles = [chef]"))
      .withFallback(ConfigFactory.load("application"))

    val system = ActorSystem("PizzaBakerSystem", config)

    // create singleton manager
    system.actorOf(ClusterSingletonManager.props(
      singletonProps = Props[PizzaService],
      terminationMessage = PoisonPill,
      settings = ClusterSingletonManagerSettings(system).withRole("chef")
    ),
      "pizzaService")

    // create singleton proxy
    system.actorOf(ClusterSingletonProxy.props(
      singletonManagerPath = "/user/pizzaService",
      settings = ClusterSingletonProxySettings(system).withRole("chef")
    ),
      "pizzaServiceProxy")
  }
}
