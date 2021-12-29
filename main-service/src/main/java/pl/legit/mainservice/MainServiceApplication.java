package pl.legit.mainservice;

import io.r2dbc.spi.ConnectionFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer;
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.config.EnableWebFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@SpringBootApplication
@EnableCaching
@EnableRabbit
@EnableR2dbcRepositories
@EnableWebFlux
public class MainServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MainServiceApplication.class, args);
    }

    @Bean
    public Queue workerQueue() {
        return new Queue("workerQueue", true);
    }

    @Bean
    ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {
        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        initializer.setDatabasePopulator(new ResourceDatabasePopulator(new ClassPathResource("schema.sql")));
        return initializer;
    }

}

interface HistoryItemRepository extends R2dbcRepository<HistoryItem, Long> {
}

@CrossOrigin(origins = "*")
@RestController
class ApplicationController {

    private final FibonacciService fibonacciService;
    private final HistoryItemRepository historyItemRepository;

    ApplicationController(FibonacciService fibonacciService, HistoryItemRepository historyItemRepository) {
        this.fibonacciService = fibonacciService;
        this.historyItemRepository = historyItemRepository;
    }

    @PostMapping("/{key}")
    public Mono<HistoryItem> calculate(@PathVariable Long key){
        final Long value = fibonacciService.calculate(key);
        return this.historyItemRepository.save(new HistoryItem(key, value));
    }

    @GetMapping("/calculations")
    public Flux<HistoryItem> findAllHistoryItems(){
        return historyItemRepository.findAll();
    }

}

@Service
class FibonacciService {

    private final RabbitTemplate rabbitTemplate;

    FibonacciService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Cacheable(value= "fibonacci", key="#key")
    public Long calculate(Long key)  {
        return (Long) rabbitTemplate.convertSendAndReceive("workerQueue", key);
    }

}

class HistoryItem implements Persistable<Long> {
    @Id
    private Long id;
    private Long key;
    private Long value;
    private LocalDateTime creationDateTime = LocalDateTime.now();

    HistoryItem(Long key, Long value) {
        this.key = key;
        this.value = value;
    }

    protected HistoryItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getKey() {
        return key;
    }

    public void setKey(Long key) {
        this.key = key;
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public LocalDateTime getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(LocalDateTime creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    @Override
    public boolean isNew() {
        return id == null;
    }
}
