package com.eseict.ssc.websocket.presentation;

import com.eseict.ssc.websocket.application.service.SocketService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * SocketController (refac) — MRS 테스트 이벤트 발생 API
 *
 * 기존(controller/socket/SocketController):
 *   - 패키지 변경 및 refac SocketService 사용
 *   - URL 동일 유지 (/newsocket/event/situation, /newsocket/event/status)
 */
@RestController
@RequestMapping(value = "/newsocket", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class SocketController {

    private final SocketService socketService;

    @ApiOperation(value = "상황 이벤트 발생", notes = "소켓으로 이벤트 발생하는 상황을 만들어준다.")
    @PostMapping("/event/situation")
    public void sendEventSituation(
            @RequestParam("mgtNo")   String mgtNo,
            @RequestParam("eventCd") String eventCd) {
        // mgtNo   : 경로당 관리번호
        // eventCd : 01(비상벨) 02(화재) 03(가스)
        socketService.sendEventSituation(mgtNo, eventCd);
    }

    @ApiOperation(value = "상태 이벤트 발생", notes = "소켓으로 이벤트 발생하는 상태를 만들어준다.")
    @PostMapping("/event/status")
    public void sendEventStatus(
            @RequestParam("mgtNo") String mgtNo,
            @RequestParam("gdCd")  String gdCd) {
        // mgtNo : 상태가 변경될 시설물의 관리번호
        // gdCd  : 00(정상) 그 외(고장)
        socketService.sendEventStatus(mgtNo, gdCd);
    }
}
