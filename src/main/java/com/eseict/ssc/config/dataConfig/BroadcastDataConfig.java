package com.eseict.ssc.config.dataConfig;

import com.eseict.ssc.config.ApiConstants;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;

import static com.eseict.ssc.config.DbConstants.Broadcast.entity_manager_factory_ref;
import static com.eseict.ssc.config.DbConstants.Broadcast.transaction_manager_ref;

@Configuration
@EnableJpaRepositories(
        basePackages = {
                "com.eseict.ssc.repository.share.broadcast",
        },
        entityManagerFactoryRef = entity_manager_factory_ref,
        transactionManagerRef = transaction_manager_ref
)
@Slf4j
public class BroadcastDataConfig {


    @Value("${spring.datasource.broadcast.jdbc-url}")
    String jdbcUrl;
    @Value("${spring.datasource.broadcast.username}")
    String userName;
    @Value("${spring.datasource.broadcast.password}")
    String password;
    @Value("${spring.datasource.broadcast.driver-class-name}")
    String driverName;
    @Value("${spring.datasource.broadcast.dialect}")
    private String dialect;
    @Value("${spring.datasource.hikari.maximum-pool-size}")
    private String maxPoolSize;
    @Value("${spring.datasource.hikari.connection-timeout}")
    private String connectionTimeout;

    @Bean(name = "broadcastDataSource")
    public DataSource dataSource() {
        HikariDataSource hikariDataSource = new HikariDataSource();
        hikariDataSource.setJdbcUrl(jdbcUrl);
        hikariDataSource.setDriverClassName(driverName);
        hikariDataSource.setUsername(userName);
        hikariDataSource.setPassword(password);
        hikariDataSource.setMaximumPoolSize(Integer.parseInt(maxPoolSize));
        hikariDataSource.setConnectionTimeout(Long.parseLong(connectionTimeout));
        hikariDataSource.setDataSourceProperties(jpaHibernateProperties());

        log.info("####################################################################################################################");
        log.info("## SSC BROADCAST DataSource Info.");
        log.info("Driver   : {}", driverName);
        log.info("URL      : {}", jdbcUrl);
        log.info("USERNAME : {}", userName);
        log.info("PASSWORD : {}", password);
        log.info("####################################################################################################################");

        return hikariDataSource;
    }

    private Properties jpaHibernateProperties() {
        Properties props = new Properties();
        props.setProperty("hibernate.show_sql", "false");
        props.setProperty("hibernate.format_sql", "true");
        props.setProperty("hibernate.jdbc.time_zone", ApiConstants.Common.TIME_ZONE);
        props.setProperty("hibernate.dialect", dialect);
        props.setProperty("hibernate.c3p0.max_size", maxPoolSize);
        props.setProperty("hibernate.c3p0.timeout", connectionTimeout);
        return props;
    }

    @Autowired
    @Bean(name = transaction_manager_ref)
    public JpaTransactionManager jpaTransactionManager(@Qualifier(entity_manager_factory_ref) LocalContainerEntityManagerFactoryBean entityManagerFactoryBean) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactoryBean.getObject());
        return transactionManager;
    }

    @Bean(name = entity_manager_factory_ref)
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean(
            EntityManagerFactoryBuilder builder,
            @Qualifier("broadcastDataSource") DataSource ds) {

        LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        jpaVendorAdapter.setShowSql(true);
        factoryBean.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        factoryBean.setJpaVendorAdapter(jpaVendorAdapter);
        factoryBean.setDataSource(ds);
        factoryBean.setJpaProperties(jpaHibernateProperties());
        factoryBean.setPackagesToScan(
                "com.eseict.ssc.sms.domain.entity"
        );
        return factoryBean;
    }
}
