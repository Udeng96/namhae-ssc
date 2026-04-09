package com.eseict.ssc.repository.social;

import com.eseict.ssc.open.domain.entity.Forecast;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForecastRepository extends JpaRepository<Forecast, String> {
    List<Forecast> findFirstByOrderByRegDtmDesc();
}
