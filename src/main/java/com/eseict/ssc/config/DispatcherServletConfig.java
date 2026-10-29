package com.eseict.ssc.config;

import com.eseict.ssc.interceptor.LoginInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.*;

import java.util.concurrent.TimeUnit;

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
     * 포함: /sc/mng (운영 대시보드) — OMS 진입 관문 1곳만 체크한다.
     * 제외: 그 외 모든 경로 (API, 키오스크 화면, 정적 리소스, /logout 등)
     *
     * 운영 정책:
     *   - OMS 인증은 관리자가 /sc/mng 으로 진입하는 순간 1회만 수행 (ViewController.scMngView)
     *   - API 각각에는 인터셉터를 걸지 않음 — 폐쇄망 내부이고, 매 API 마다 OMS tokenAlive 를
     *     치는 방식은 성능 저하 + 키오스크 화면(/sc/social, /sc/noti 등)에서
     *     401 로 OMS 로그인으로 튕기는 버그의 원인이었다.
     *   - 세션 만료 시에는 프론트 apiClient 의 401 핸들러가 처리.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/sc/mng");
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


    /**
     * 정적 리소스 핸들러.
     *
     * <p>이 클래스에 {@code @EnableWebMvc} 가 있어 Spring Boot 의 정적 리소스 자동설정이
     * 꺼져 있다. 따라서 {@code spring.web.resources.cache.*} 같은 application.yml 설정은
     * 무시되고, 캐시 정책은 여기서 직접 지정해야 한다.
     *
     * <p>프론트 산출물(front/dist/assets)은 파일명에 내용 해시가 박혀 있어
     * (index-&lt;hash&gt;.js, Pretendard-Bold-&lt;hash&gt;.ttf) 내용이 바뀌면 파일명도 바뀐다.
     * 그래서 오래 캐시해도 낡은 파일이 물리지 않는다.
     *
     * <p>경로당 230곳의 모니터가 아침 타이머로 한꺼번에 켜지는데
     * (2026-09-17 실측: 10:00 한 분 동안 107대), 캐시 지시가 없어 부팅마다 파일마다
     * 재검증 요청(304)이 서버로 몰렸다.
     *
     * <p>index.html 은 templates/ 에서 ViewController 가 서빙하므로 이 설정의 영향을
     * 받지 않는다 — 새 배포는 그대로 즉시 반영된다.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        CacheControl hashedAsset = CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic();

        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/")
                .setCacheControl(hashedAsset).resourceChain(true);
        registry.addResourceHandler("/vite.svg").addResourceLocations("classpath:/static/assets").resourceChain(true);
        registry.addResourceHandler("/**").addResourceLocations("classpath:/resources/");
        registry.addResourceHandler("/**").addResourceLocations("classpath:/templates/");
        registry.addResourceHandler("/**").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/assets/**").addResourceLocations("classpath:/static/assets")
                .setCacheControl(hashedAsset);

        // 업로드 파일(영상·이미지)과 전광판 콘텐츠는 정적 핸들러가 아니라
        // FileController 의 /newfile/** 이 SSC_HOME 기준으로 서빙한다.
        //   - ApiConstants.HOME_PATH = SystemProperties.getProperty("SSC_HOME")
        //   - FileService.serveFile() / serveVmsFile()
        // 여기에 있던 /video/**, /contents/** 는 전광판 기능 초기 구현(6337ccfa) 때
        // 개발자 로컬 맥 경로를 하드코딩해 둔 잔재였고, 운영에는 그 경로가 없어
        // 아무것도 서빙하지 못했다. 프론트 번들에도 해당 URL 사용이 없어 제거한다.
    }




}
