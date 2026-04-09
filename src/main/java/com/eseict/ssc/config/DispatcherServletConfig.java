package com.eseict.ssc.config;

import com.eseict.ssc.interceptor.LoginInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.*;

@Component
@EnableWebMvc
@EnableAsync
@RequiredArgsConstructor
@ComponentScan(basePackages = "com.eseict")
public class DispatcherServletConfig implements WebMvcConfigurer {

    private final LoginInterceptor loginInterceptor;

    // ── 인터셉터 등록 ─────────────────────────────────────────────────────────

    /**
     * 토큰 유효성 검사 인터셉터 적용 범위:
     *
     * 포함: /sc/mng (운영 대시보드), API 경로 전체
     * 제외:
     *   - /sc/conf      → 화상회의 화면 (URL 파라미터로 자체 토큰 처리)
     *   - /sc/social/** → 경로당 키오스크 (공개 화면)
     *   - /sc/noti/**   → 공지 화면 (공개 화면)
     *   - /logout       → 로그아웃 자체 처리
     *   - /server/**    → 헬스체크
     *   - /static/**, /assets/**, /vite.svg → 정적 리소스
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/sc/mng",
                        "/event/**", "/openapi/**", "/addr/**", "/user/**",
                        "/sms/**", "/broadcast/**", "/fac/**", "/share/**",
                        "/conf/**", "/seniorSche/**", "/stat/**",
                        "/notiSche/**", "/sche/**", "/fire/**")
                .excludePathPatterns(
                        "/sc/conf",
                        "/sc/social/**",
                        "/sc/noti/**",
                        "/logout",
                        "/server/**",
                        "/static/**",
                        "/assets/**",
                        "/vite.svg"
                );
    }

    // ── CORS ─────────────────────────────────────────────────────────────────

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        WebMvcConfigurer.super.addCorsMappings(registry);

        registry.addMapping("/**") // cors를 적용할 url 패턴
                .allowedOrigins("*") // 모든 origin 허락
                .allowedMethods("GET","POST","PUT","DELETE")
                .allowedHeaders("Authorization","*")
                .exposedHeaders("Custom-Header") // 클라이언트 측 응답에서 노출되는 헤더
                .allowCredentials(false)  // credencial 포함할 수 있는지
                .maxAge(3600); // 해당 시간만큼 pre-flight 리퀘스트 캐싱 가능
    }


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/assets").resourceChain(true);
        registry.addResourceHandler("/vite.svg").addResourceLocations("classpath:/static/assets").resourceChain(true);
        registry.addResourceHandler("/**").addResourceLocations("classpath:/resources/");
        registry.addResourceHandler("/**").addResourceLocations("classpath:/templates/");
        registry.addResourceHandler("/**").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/assets/**").addResourceLocations("classpath:/static/assets");
        registry.addResourceHandler("/video/**").addResourceLocations("file:/Users/jang-youjeong/workspace/namhae/senior/src/main/resources/file/").setCachePeriod(0);
        registry.addResourceHandler("/contents/**").addResourceLocations("file:/Users/jang-youjeong/workspace/namhae/senior/src/main/resources/crosswalk/").setCachePeriod(0);
    }




}
