import { STAT_IMAGE } from '@/component/lib/statImage';
import moment from 'moment';

// ─── 탭 타입 ──────────────────────────────────────────
export const STAT_TYPE = {
  EVENT:   { id: 'event',  nm: '이벤트 발생'   },
  FAC:     { id: 'fac',   nm: '시설물 고장'    },
  OPERATE: { id: 'oper',  nm: '가동률'         },
  USAGE:   { id: 'usage', nm: '서비스 이용률'  },
} as const;

export const STAT_TYPE_LIST = [
  STAT_TYPE.EVENT,
  STAT_TYPE.FAC,
  STAT_TYPE.OPERATE,
  STAT_TYPE.USAGE,
];

// ─── GIS 배경 맵: znCd → 이미지 ─────────────────────
export const STAT_NORM_MAP: Record<string, string> = {
  '401': STAT_IMAGE.GIS.BACK.NORM.NH,
  '402': STAT_IMAGE.GIS.BACK.NORM.ID,
  '403': STAT_IMAGE.GIS.BACK.NORM.SJ,
  '404': STAT_IMAGE.GIS.BACK.NORM.SD,
  '405': STAT_IMAGE.GIS.BACK.NORM.MJ,
  '406': STAT_IMAGE.GIS.BACK.NORM.NM,
  '407': STAT_IMAGE.GIS.BACK.NORM.SM,
  '408': STAT_IMAGE.GIS.BACK.NORM.GH,
  '409': STAT_IMAGE.GIS.BACK.NORM.SCH,
  '410': STAT_IMAGE.GIS.BACK.NORM.CS,
};

export const STAT_HOVER_MAP: Record<string, string> = {
  '401': STAT_IMAGE.GIS.BACK.HOVER.NH,
  '402': STAT_IMAGE.GIS.BACK.HOVER.ID,
  '403': STAT_IMAGE.GIS.BACK.HOVER.SJ,
  '404': STAT_IMAGE.GIS.BACK.HOVER.SD,
  '405': STAT_IMAGE.GIS.BACK.HOVER.MJ,
  '406': STAT_IMAGE.GIS.BACK.HOVER.NM,
  '407': STAT_IMAGE.GIS.BACK.HOVER.SM,
  '408': STAT_IMAGE.GIS.BACK.HOVER.GH,
  '409': STAT_IMAGE.GIS.BACK.HOVER.SCH,
  '410': STAT_IMAGE.GIS.BACK.HOVER.CS,
};

// ─── POI 색상 등급 (이벤트/시설물/가동률) ───────────
export const STAT_POI_COLOR_GRADE = [
  STAT_IMAGE.GIS.POI.EVENT.GOOD.NORM,
  STAT_IMAGE.GIS.POI.EVENT.NOT_GOOD.NORM,
  STAT_IMAGE.GIS.POI.EVENT.NOT_BAD.NORM,
  STAT_IMAGE.GIS.POI.EVENT.BAD.NORM,
];
export const STAT_POI_COLOR_HOVER_GRADE = [
  STAT_IMAGE.GIS.POI.EVENT.GOOD.HOVER,
  STAT_IMAGE.GIS.POI.EVENT.NOT_GOOD.HOVER,
  STAT_IMAGE.GIS.POI.EVENT.NOT_BAD.HOVER,
  STAT_IMAGE.GIS.POI.EVENT.BAD.HOVER,
];

export const STAT_POI_FAC_COLOR_GRADE = [
  STAT_IMAGE.GIS.POI.FAC.GOOD.NORM,
  STAT_IMAGE.GIS.POI.FAC.NOT_GOOD.NORM,
  STAT_IMAGE.GIS.POI.FAC.NOT_BAD.NORM,
  STAT_IMAGE.GIS.POI.FAC.BAD.NORM,
];
export const STAT_POI_FAC_COLOR_HOVER_GRADE = [
  STAT_IMAGE.GIS.POI.FAC.GOOD.HOVER,
  STAT_IMAGE.GIS.POI.FAC.NOT_GOOD.HOVER,
  STAT_IMAGE.GIS.POI.FAC.NOT_BAD.HOVER,
  STAT_IMAGE.GIS.POI.FAC.BAD.HOVER,
];

export const STAT_POI_OPER_COLOR_GRADE = [
  STAT_IMAGE.GIS.POI.OPER.GOOD.NORM,
  STAT_IMAGE.GIS.POI.OPER.NOT_GOOD.NORM,
  STAT_IMAGE.GIS.POI.OPER.MID.NORM,
  STAT_IMAGE.GIS.POI.OPER.NOT_BAD.NORM,
  STAT_IMAGE.GIS.POI.OPER.BAD.NORM,
];
export const STAT_POI_OPER_COLOR_HOVER_GRADE = [
  STAT_IMAGE.GIS.POI.OPER.GOOD.HOVER,
  STAT_IMAGE.GIS.POI.OPER.NOT_GOOD.HOVER,
  STAT_IMAGE.GIS.POI.OPER.MID.HOVER,
  STAT_IMAGE.GIS.POI.OPER.NOT_BAD.HOVER,
  STAT_IMAGE.GIS.POI.OPER.BAD.HOVER,
];

// ─── 지역별 경로당 좌표 목록 ─────────────────────────
export const STAT_SC_NH = [
  { nm: '유림1리제2', top: '139px', left: '236px' },
  { nm: '아산',       top: '191px', left: '82px'  },
  { nm: '오동',       top: '94px',  left: '114px' },
  { nm: '심천',       top: '59px',  left: '329px' },
  { nm: '동산',       top: '75px',  left: '394px' },
  { nm: '현대',       top: '74px',  left: '245px' },
  { nm: '유림1',      top: '125px',  left: '318px' },
  { nm: '중촌',       top: '127px',  left: '452px' },
  { nm: '선소',       top: '128px',  left: '521px' },
  { nm: '봉전',       top: '169px', left: '157px' },
  { nm: '북변2',      top: '193px', left: '266px' },
  { nm: '북변1',      top: '185px', left: '340px' },
  { nm: '곡내',       top: '172px', left: '403px' },
  { nm: '신기',       top: '249px', left: '149px' },
  { nm: '서변',       top: '228px', left: '209px' },
  { nm: '남변',       top: '236px', left: '318px' },
  { nm: '죽산',       top: '232px', left: '381px' },
  { nm: '남산',       top: '264px', left: '264px' },
  { nm: '봉내',       top: '287px', left: '394px' },
  { nm: '마산',       top: '297px', left: '315px' },
  { nm: '소입현',     top: '321px', left: '460px' },
  { nm: '토촌',       top: '296px', left: '533px' },
  { nm: '광포',       top: '342px', left: '379px' },
  { nm: '섬호',       top: '322px', left: '618px' },
  { nm: '신촌',       top: '351px', left: '255px' },
  { nm: '내금',       top: '396px', left: '464px' },
  { nm: '대입현',     top: '372px', left: '540px' },
  { nm: '양지',       top: '413px', left: '200px' },
  { nm: '아촌',       top: '442px', left: '282px' },
  { nm: '외금',       top: '441px', left: '388px' },
  { nm: '평현',       top: '490px', left: '238px' },
  { nm: '봉성',       top: '550px', left: '323px' },
];

export const STAT_SC_ID = [
  { nm: '초양', top: '62px', left: '171px' },
  { nm: '광두', top: '83px', left: '281px' },
  { nm: '다정분대', top: '154px', left: '73px' },
  { nm: '초곡', top: '134px', left: '149px' },
  { nm: '초음', top: '139px', left: '220px' },
  { nm: '고모', top: '175px', left: '293px' },
  { nm: '다정', top: '231px', left: '83px' },
  { nm: '금석', top: '223px', left: '153px' },
  { nm: '다천', top: '223px', left: '215px' },
  { nm: '석평', top: '273px', left: '251px' },
  { nm: '정거', top: '275px', left: '330px' },
  { nm: '난양', top: '229px', left: '418px' },
  { nm: '장전', top: '295px', left: '404px' },
  { nm: '난음', top: '273px', left: '497px' },
  { nm: '무림', top: '335px', left: '294px' },
  { nm: '성현', top: '380px', left: '356px' },
  { nm: '문현', top: '336px', left: '460px' },
  { nm: '봉곡', top: '403px', left: '425px' },
  { nm: '용소', top: '461px', left: '183px' },
  { nm: '화계', top: '440px', left: '251px' },
  { nm: '신전', top: '447px', left: '328px' },
  { nm: '금평', top: '481px', left: '391px' },
  { nm: '원천', top: '566px', left: '306px' },
];

export const STAT_SC_SJ = [
  { nm: '벽련', top: '263px', left: '111px' },
  { nm: '두모', top: '345px', left: '165px' },
  { nm: '대량', top: '438px', left: '227px' },
  { nm: '소량', top: '506px', left: '180px' },
  { nm: '금양', top: '371px', left: '404px' },
  { nm: '임촌', top: '411px', left: '479px' },
  { nm: '금전', top: '501px', left: '375px' },
  { nm: '상주', top: '479px', left: '454px' },
  { nm: '금포', top: '473px', left: '578px' },
];

export const STAT_SC_SD = [
  { nm: '지족1리', top: '30px', left: '171px' },
  { nm: '지족3리', top: '15px', left: '272px' },
  { nm: '수장포', top: '94px', left: '143px' },
  { nm: '지족2리', top: '72px', left: '228px' },
  { nm: '전도', top: '45px', left: '369px' },
  { nm: '수곡음지마을', top: '166px', left: '43px' },
  { nm: '고암', top: '157px', left: '113px' },
  { nm: '금송', top: '119px', left: '318px' },
  { nm: '둔촌', top: '71px', left: '446px' },
  { nm: '화천', top: '138px', left: '460px' },
  { nm: '금천', top: '111px', left: '527px' },
  { nm: '영지', top: '237px', left: '49px' },
  { nm: '시문', top: '247px', left: '138px' },
  { nm: '갈현', top: '243px', left: '235px' },
  { nm: '삼화', top: '232px', left: '305px' },
  { nm: '봉화', top: '279px', left: '375px' },
  { nm: '화암', top: '237px', left: '423px' },
  { nm: '합동', top: '213px', left: '489px' },
  { nm: '양화', top: '155px', left: '609px' },
  { nm: '내동천', top: '229px', left: '577px' },
  { nm: '독일마을', top: '306px', left: '474px' },
  { nm: '물건', top: '323px', left: '538px' },
  { nm: '은점', top: '393px', left: '563px' },
  { nm: '내산', top: '481px', left: '334px' },
  { nm: '대지포', top: '476px', left: '536px' },
];

export const STAT_SC_MJ = [
  { nm: '노구', top: '68px', left: '400px' },
  { nm: '가인', top: '138px', left: '414px' },
  { nm: '항도', top: '184px', left: '350px' },
  { nm: '천하', top: '344px', left: '95px' },
  { nm: '송정', top: '337px', left: '181px' },
  { nm: '초전', top: '306px', left: '251px' },
  { nm: '송남', top: '401px', left: '217px' },
  { nm: '미조', top: '418px', left: '322px' },
  { nm: '설리', top: '505px', left: '186px' },
  { nm: '답하', top: '504px', left: '269px' },
  { nm: '사항', top: '456px', left: '392px' },
  { nm: '팔랑', top: '525px', left: '337px' },
  { nm: '조도', top: '593px', left: '377px' },
];

export const STAT_SC_CS = [
  { nm: '단항', top: '71px', left: '309px' },
  { nm: '대벽', top: '102px', left: '241px' },
  { nm: '냉천', top: '138px', left: '357px' },
  { nm: '소벽', top: '163px', left: '206px' },
  { nm: '율도', top: '210px', left: '159px' },
  { nm: '당항', top: '207px', left: '300px' },
  { nm: '고순', top: '270px', left: '192px' },
  { nm: '서대', top: '319px', left: '123px' },
  { nm: '곤유', top: '315px', left: '277px' },
  { nm: '보천', top: '364px', left: '72px' },
  { nm: '동대', top: '377px', left: '219px' },
  { nm: '광천', top: '425px', left: '18px' },
  { nm: '상죽', top: '449px', left: '188px' },
  { nm: '사포', top: '497px', left: '57px' },
  { nm: '당저1', top: '483px', left: '282px' },
  { nm: '옥천', top: '529px', left: '158px' },
  { nm: '수산', top: '544px', left: '256px' },
  { nm: '신흥', top: '575px', left: '77px' },
  { nm: '지족', top: '621px', left: '195px' },
  { nm: '당저2', top: '595px', left: '292px' },
  { nm: '연포', top: '235px', left: '381px' },
  { nm: '고두', top: '271px', left: '438px' },
  { nm: '식포', top: '338px', left: '367px' },
  { nm: '가인', top: '343px', left: '537px' },
  { nm: '천포', top: '343px', left: '463px' },
  { nm: '상신', top: '418px', left: '312px' },
  { nm: '연곡', top: '422px', left: '443px' },
  { nm: '오용', top: '461px', left: '373px' },
  { nm: '적량', top: '446px', left: '521px' },
  { nm: '대곡', top: '508px', left: '480px' },
  { nm: '부윤1', top: '538px', left: '345px' },
  { nm: '부윤2', top: '609px', left: '466px' },
  { nm: '장포', top: '570px', left: '538px' },
  { nm: '물미', top: '579px', left: '400px' },
];

export const STAT_SC_SM = [
  { nm: '정포마을제1', top: '19px', left: '260px' },
  { nm: '우물', top: '17px', left: '371px' },
  { nm: '회룡', top: '83px', left: '219px' },
  { nm: '중현', top: '65px', left: '330px' },
  { nm: '노구', top: '147px', left: '209px' },
  { nm: '도산', top: '127px', left: '363px' },
  { nm: '현촌', top: '105px', left: '450px' },
  { nm: '우포', top: '204px', left: '173px' },
  { nm: '염해', top: '236px', left: '106px' },
  { nm: '중리', top: '275px', left: '171px' },
  { nm: '남상', top: '322px', left: '229px' },
  { nm: '작장', top: '373px', left: '177px' },
  { nm: '상남', top: '435px', left: '145px' },
  { nm: '연죽', top: '422px', left: '448px' },
  { nm: '예계', top: '518px', left: '250px' },
  { nm: '서상', top: '590px', left: '296px' },
  { nm: '서호', top: '557px', left: '372px' },
  { nm: '남정', top: '573px', left: '440px' },
  { nm: '대정', top: '527px', left: '481px' },
  { nm: '장항', top: '680px', left: '334px' },
  { nm: '금곡', top: '640px', left: '451px' },
  { nm: '동정', top: '605px', left: '525px' },
];

export const STAT_SC_GH = [
  { nm: '서갈화', top: '291px', left: '114px' },
  { nm: '화전', top: '359px', left: '85px' },
  { nm: '동갈화', top: '354px', left: '159px' },
  { nm: '차면', top: '105px', left: '274px' },
  { nm: '북남치', top: '126px', left: '538px' },
  { nm: '동남치', top: '191px', left: '517px' },
  { nm: '방월', top: '218px', left: '344px' },
  { nm: '중앙', top: '276px', left: '377px' },
  { nm: '대사', top: '256px', left: '463px' },
  { nm: '선원', top: '385px', left: '305px' },
  { nm: '포상', top: '343px', left: '360px' },
  { nm: '탑동', top: '315px', left: '427px' },
  { nm: '관당', top: '321px', left: '510px' },
  { nm: '오곡', top: '402px', left: '418px' },
  { nm: '도산', top: '457px', left: '473px' },
  { nm: '성산', top: '430px', left: '546px' },
  { nm: '도마', top: '498px', left: '536px' },
  { nm: '대계', top: '582px', left: '384px' },
  { nm: '대곡', top: '582px', left: '465px' },
  { nm: '서도마', top: '565px', left: '532px' },
  { nm: '동도마', top: '531px', left: '599px' },
  { nm: '이어제2', top: '667px', left: '610px' },
  { nm: '이어', top: '600px', left: '597px' },
  { nm: '풍산', top: '677px', left: '539px' },
];

// ※ 설천면/남면 좌표는 홈 CSS 기반 추정값 - 시각적 보정 필요
export const STAT_SC_SCH = [
  { nm: '월곡', top: '203px',  left: '42px'   },
  { nm: '감암', top: '118px',  left: '73px'  },
  { nm: '노량', top: '74px',   left: '136px' },
  { nm: '덕신', top: '188px', left: '149px' },
  { nm: '용강', top: '218px', left: '285px' },
  { nm: '왕지', top: '95px',  left: '360px' },
  { nm: '동흥', top: '149px', left: '471px' },
  { nm: '문의', top: '194px', left: '415px' },
  { nm: '봉우', top: '199px', left: '535px' },
  { nm: '남양', top: '240px', left: '471px' },
  { nm: '금음', top: '309px', left: '439px' },
  { nm: '옥동', top: '293px', left: '532px' },
  { nm: '문항', top: '370px', left: '532px' },
  { nm: '모천', top: '435px', left: '477px' },
  { nm: '고사', top: '502px', left: '455px' },
  { nm: '진목', top: '575px', left: '424px' },
  { nm: '동비', top: '606px', left: '331px' },
  { nm: '내곡', top: '539px', left: '296px' },
  { nm: '정태', top: '597px', left: '240px' },
];

export const STAT_SC_NM = [
  { nm: '유구',   top: '411px', left: '106px'   },
  { nm: '평산1',  top: '202px', left: '44px'  },
  { nm: '평산2',  top: '285px', left: '152px'  },
  { nm: '다랭이', top: '326px', left: '84px'  },
  { nm: '구미',   top: '148px',   left: '110px' },
  { nm: '오리',   top: '227px', left: '204px' },
  { nm: '북구',   top: '80px',   left: '296px' },
  { nm: '남구',   top: '144px',  left: '261px' },
  { nm: '죽전',   top: '194px', left: '319px' },
  { nm: '우형',   top: '195px', left: '408px' },
  { nm: '홍덕',   top: '250px', left: '361px' },
  { nm: '덕월',   top: '264px', left: '294px' },
  { nm: '율곡',   top: '315px', left: '343px' },
  { nm: '당항',   top: '195px', left: '482px' },
  { nm: '두곡',   top: '259px', left: '579px' },
  { nm: '양지',   top: '273px', left: '503px' },
  { nm: '석교',   top: '330px', left: '450px' },
  { nm: '월포',   top: '352px', left: '518px' },
  { nm: '숙호',   top: '412px', left: '470px' },
  { nm: '사촌',   top: '528px', left: '174px'  },
  { nm: '선구',   top: '588px', left: '148px'   },
  { nm: '항촌',   top: '639px', left: '218px'  },
  { nm: '임포',   top: '521px', left: '269px' },
  { nm: '운암',   top: '511px', left: '338px' },
  { nm: '무지개', top: '515px', left: '473px' },
  { nm: '홍현1',  top: '526px', left: '549px' },
];

// ─── 읍면별 지도 메타 ────────────────────────────────
export const STAT_AREA_NAMHAE: Record<
  string,
  { nm: string; top: string; left: string; hoverTop: string; hoverLeft: string; scList: { nm: string; top: string; left: string }[] }
> = {
  '401': { nm: '남해읍', top: '266px', left: '149px', hoverTop: '-3px',   hoverLeft: '-26px',  scList: STAT_SC_NH },
  '402': { nm: '이동면', top: '411px', left: '303px', hoverTop: '-64px',  hoverLeft: '-64px',  scList: STAT_SC_ID },
  '403': { nm: '상주면', top: '580px', left: '381px', hoverTop: '2px',    hoverLeft: '-58px',  scList: STAT_SC_SJ },
  '404': { nm: '삼동면', top: '386px', left: '493px', hoverTop: '-45px',  hoverLeft: '-107px', scList: STAT_SC_SD },
  '405': { nm: '미조면', top: '612px', left: '545px', hoverTop: '-67px',  hoverLeft: '-26px',  scList: STAT_SC_MJ },
  '406': { nm: '남면',   top: '489px', left: '121px', hoverTop: '-42px',  hoverLeft: '-52px',  scList: STAT_SC_NM },
  '407': { nm: '서면',   top: '256px', left: '23px',  hoverTop: '-71px',  hoverLeft: '-24px',  scList: STAT_SC_SM },
  '408': { nm: '고현면', top: '96px',  left: '92px', hoverTop: '-22px',  hoverLeft: '-52px',  scList: STAT_SC_GH },
  '409': { nm: '설천면', top: '6px',   left: '192px', hoverTop: '-6px',  hoverLeft: '-72px',  scList: STAT_SC_SCH },
  '410': { nm: '창선면', top: '156px', left: '474px', hoverTop: '-85px',  hoverLeft: '-83px',  scList: STAT_SC_CS },
};

// ─── 범례 색상 ───────────────────────────────────────
export const STAT_LEGEND_COLORS = {
  event: [
    { border: 'rgba(254, 213, 51, 0.50)', back: 'rgba(204, 171, 41, 0.50)' },
    { border: 'rgba(255, 159, 51, 0.50)', back: 'rgba(224, 132, 27, 0.50)' },
    { border: 'rgba(204, 84, 40, 0.50)',  back: 'rgba(204, 72, 24, 0.50)'  },
    { border: 'rgba(224, 45, 75, 0.50)',  back: 'rgba(184, 18, 46, 0.50)'  },
  ],
  fac: [
    { border: 'rgba(92, 227, 255, 0.50)',  back: 'rgba(57, 179, 204, 0.50)'  },
    { border: 'rgba(50, 153, 250, 0.50)',  back: 'rgba(37, 110, 184, 0.50)'  },
    { border: 'rgba(68, 99, 255, 0.50)',   back: 'rgba(0, 15, 183, 0.50)'    },
    { border: 'rgba(174, 117, 255, 0.50)', back: 'rgba(120, 0, 239, 0.50)'   },
  ],
  oper: [
    { border: '', back: STAT_IMAGE.CHART.LEGEND.OPER.RED    },
    { border: '', back: STAT_IMAGE.CHART.LEGEND.OPER.ORANGE },
    { border: '', back: STAT_IMAGE.CHART.LEGEND.OPER.YELLOW },
    { border: '', back: STAT_IMAGE.CHART.LEGEND.OPER.GREEN  },
    { border: '', back: STAT_IMAGE.CHART.LEGEND.OPER.BLUE   },
  ],
};

// ─── 기간 선택 ───────────────────────────────────────
export const STAT_PERIOD_TYPE = {
  WEEK:        { nm: '일주일', cd: 'aWeek',  endDtm: moment().format('YYYYMMDD'), startDtm: moment().subtract(7, 'days').format('YYYYMMDD')    },
  ONE_MONTH:   { nm: '당월',   cd: 'aMonth', endDtm: moment().format('YYYYMMDD'), startDtm: moment().subtract(1, 'months').format('YYYYMMDD')  },
  THREE_MONTH: { nm: '3개월',  cd: 'tMonth', endDtm: moment().format('YYYYMMDD'), startDtm: moment().subtract(3, 'months').format('YYYYMMDD')  },
  SIX_MONTH:   { nm: '6개월',  cd: 'sMonth', endDtm: moment().format('YYYYMMDD'), startDtm: moment().subtract(6, 'months').format('YYYYMMDD')  },
  YEAR:        { nm: '1년',    cd: 'aYear',  endDtm: moment().format('YYYYMMDD'), startDtm: moment().subtract(1, 'years').format('YYYYMMDD')   },
};

export const STAT_PERIOD_LIST = [
  STAT_PERIOD_TYPE.WEEK,
  STAT_PERIOD_TYPE.ONE_MONTH,
  STAT_PERIOD_TYPE.THREE_MONTH,
  STAT_PERIOD_TYPE.SIX_MONTH,
  STAT_PERIOD_TYPE.YEAR,
];
