package com.eseict.ssc.config.dataConfig;

import com.eseict.ssc.config.ApiConstants;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;

import static com.eseict.ssc.config.DbConstants.Rino.entity_manager_factory_ref;
import static com.eseict.ssc.config.DbConstants.Rino.transaction_manager_ref;


@Slf4j
@Configuration
@EnableJpaRepositories(
        basePackages = {
                "com.eseict.ssc.repository.conf",
                "com.eseict.ssc.repository.event",
                "com.eseict.ssc.repository.fac",
                "com.eseict.ssc.repository.oms",
                "com.eseict.ssc.repository.sche",
                "com.eseict.ssc.repository.scm",
                "com.eseict.ssc.repository.share.common",
                "com.eseict.ssc.repository.social",
                "com.eseict.ssc.repository.user",
        },
        entityManagerFactoryRef = entity_manager_factory_ref,
        transactionManagerRef = transaction_manager_ref
)

public class DataConfig {

    // primary
    @Value("${spring.datasource.primary.jdbc-url}")
    String jdbcUrl;
    @Value("${spring.datasource.primary.username}")
    String userName;
    @Value("${spring.datasource.primary.password}")
    String password;
    @Value("${spring.datasource.primary.driver-class-name}")
    String driverName;
    @Value("${spring.datasource.primary.dialect}")
    private String dialect;
    @Value("${spring.datasource.hikari.maximum-pool-size}")
    private String maxPoolSize;
    @Value("${spring.datasource.hikari.connection-timeout}")
    private String connectionTimeout;

    @Primary
    @Bean(name = "rino")
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
        log.info("## SSC PRIMARY DataSource Info.");
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

    @Primary
    @Autowired
    @Bean(name = transaction_manager_ref)
    public JpaTransactionManager jpaTransactionManager(@Qualifier(entity_manager_factory_ref) LocalContainerEntityManagerFactoryBean entityManagerFactoryBean) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactoryBean.getObject());
        return transactionManager;
    }

    @Primary
    @Bean(name = entity_manager_factory_ref)
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean(
            EntityManagerFactoryBuilder builder,
            @Qualifier("rino") DataSource ds) {
        LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        jpaVendorAdapter.setShowSql(true);
        factoryBean.setJpaVendorAdapter(jpaVendorAdapter);
        factoryBean.setDataSource(ds);
        factoryBean.setPackagesToScan(
                "com.eseict.ssc.conf.domain.entity",
                "com.eseict.ssc.user.domain.entity",
                "com.eseict.ssc.facility.domain.entity",
                "com.eseict.ssc.monitoring.domain.entity",
                "com.eseict.ssc.sms.domain.entity",
                "com.eseict.ssc.schedule.domain.entity",
                "com.eseict.ssc.open.domain.entity"
        );
        factoryBean.setJpaProperties(jpaHibernateProperties());
        return factoryBean;
    }
}
