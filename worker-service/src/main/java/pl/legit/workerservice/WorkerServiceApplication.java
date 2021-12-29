package pl.legit.workerservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableRabbit
public class WorkerServiceApplication {

    private final static Logger log = LoggerFactory.getLogger(WorkerServiceApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(WorkerServiceApplication.class, args);
    }

    @Bean
    public Queue workerQueue() {
        return new Queue("workerQueue", true);
    }

    @RabbitListener(queues = "workerQueue")
    public Long listen(Long in) {
        return calculate(in);
    }

    private Long calculate(Long key)  {
        log.info("Calculating Fibonacci for key: " + key);
        return  (key < 2) ? key : calculate(key - 1) + calculate(key - 2);
    }

}
