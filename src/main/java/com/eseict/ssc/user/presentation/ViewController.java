package com.eseict.ssc.user.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.user.application.service.UserCommandService;
import com.google.common.base.Strings;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * ViewController (refac) — 뷰 라우팅 및 로그아웃
 *
 * 기존: /sc/mng 등 (ViewController) → UserService 혼재
 * 개선:
 *   - 로그아웃 → UserCommandService 위임 (CQRS 명령 측)
 *   - 뷰 라우팅 경로는 기존과 동일 유지 (프론트 연동)
 */
@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping(value = "", produces = ApiConstants.Common.API_PRODUCES)
public class ViewController {

    private final UserCommandService userCommandService;

    @ApiOperation(value = "운영 대시보드")
    @RequestMapping("/sc/mng")
    public String scMngView(
            @RequestParam(required = false, defaultValue = "", value = "token") String token,
            HttpServletRequest request,
            HttpServletResponse response) {

        HttpSession session = request.getSession();
        String sessionToken = "";

        if (session.getAttribute("__TOKEN__") != null
                || session.getAttribute("token") != null
                || !Strings.isNullOrEmpty(token)) {
            if (session.getAttribute("__TOKEN__") != null
                    && !session.getAttribute("__TOKEN__").toString().isEmpty()) {
                sessionToken = session.getAttribute("__TOKEN__").toString();
            } else if (session.getAttribute("token") != null
                    && !session.getAttribute("token").toString().isEmpty()) {
                sessionToken = session.getAttribute("token").toString();
            } else if (!token.isEmpty()) {
                sessionToken = token;
            }
        }

        if (sessionToken.isEmpty()) {
            log.info("token is empty. -> redirect to login page");
            try {
                response.sendRedirect("/oms/login/getLoginView");
            } catch (IOException e) {
                log.error("Error on redirect login page: {}", e.getMessage());
                throw new RuntimeException(e);
            }
        } else {
            response.addCookie(new Cookie("token", sessionToken));
        }
        return "index";
    }

    @ApiOperation(value = "경로당 화면")
    @GetMapping("/sc/social/{scNm}")
    public String scSocialView(HttpServletRequest request, HttpServletResponse response,
                                @PathVariable(value = "scNm") String scNm) {
        return "index";
    }

    @ApiOperation(value = "엑셀 일괄 업로드 화면")
    @GetMapping("/sc/fac/excel")
    public String scFacExcelView() {
        return "index";
    }

    @ApiOperation(value = "공지 화면 (가로 화면)")
    @GetMapping("/sc/noti/{scNm}")
    public String scNotiView(@PathVariable String scNm) {
        return "index";
    }

    @GetMapping("/sc/conf")
    public String scConferenceView(
            @RequestParam(required = false, defaultValue = "", value = "token") String token,
            HttpServletRequest request,
            HttpServletResponse response) {

        HttpSession session = request.getSession();
        session.setAttribute("__TOKEN__", token);
        session.setAttribute("token", token);
        response.addCookie(new Cookie("token", token));
        return "index";
    }

    @ApiOperation(value = "로그아웃")
    @PostMapping("/logout")
    @ResponseBody
    public String doLogout(
            @RequestParam(value = "token", required = false) String token,
            HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session) {

        log.info("request logout");
        if (Strings.isNullOrEmpty(token)) {
            token = (String) request.getSession().getAttribute("__TOKEN__");
        }

        if (ApiConstants.IS_DEV.equals(ApiConstants.IsDev.DEV)) {
            log.info("logout success in dev mode");
            return "";
        }

        if (!Strings.isNullOrEmpty(token)) {
            String logoutUrl = userCommandService.doLogout(token);
            if (!logoutUrl.isEmpty()) {
                log.info("redirect logout url: {}", logoutUrl);
                return logoutUrl;
            }
            log.info("logout failed");
        }
        return "";
    }
}
