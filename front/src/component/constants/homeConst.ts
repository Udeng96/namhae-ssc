/**
 * 홈(Dashboard) 화면 상수
 * - 지역 패널 위치 / 배경 이미지 / 경로당 아이콘 위치 목록
 */
import { HOME_MAP } from '../lib/homeImage';

// ─── 지역 패널 표출 순서 (CSS nth-child 기반) ──────────────
export const NAMHAE_ORDER = ['408', '407', '401', '410', '402', '404', '403', '405'];

// ─── 경로당 아이콘 위치 목록 ────────────────────────────────
export type ScIconItem = { nm: string; top: string; left: string };

export const NAMHAE_SC_ICON: ScIconItem[] = [
  { nm: '오동경로당', top: '195px', left: '682px' },
  { nm: '심천경로당', top: '94px', left: '925px' },
  { nm: '동산경로당', top: '107px', left: '1050px' },
  { nm: '중촌경로당', top: '129px', left: '1100px' },
  { nm: '곡내경로당', top: '170px', left: '1076px' },
  { nm: '선소경로당', top: '107px', left: '1207px' },
  { nm: '아산경로당', top: '278px', left: '756px' },
  { nm: '봉전경로당', top: '275px', left: '849px' },
  { nm: '신기경로당', top: '300px', left: '839px' },
  { nm: '서변경로당', top: '289px', left: '913px' },
  { nm: '현대경로당', top: '181px', left: '938px' },
  { nm: '유림1경로당', top: '201px', left: '918px' },
  { nm: '유림1리제2경로당', top: '222px', left: '891px' },
  { nm: '유림2경로당', top: '222px', left: '871px' },
  { nm: '북변1경로당', top: '251px', left: '999px' },
  { nm: '북변2경로당', top: '263px', left: '949px' },
  { nm: '남변경로당', top: '270px', left: '1015px' },
  { nm: '죽산경로당', top: '280px', left: '1036px' },
  { nm: '남산경로당', top: '307px', left: '981px' },
  { nm: '봉내경로당', top: '314px', left: '1051px' },
  { nm: '마산경로당', top: '347px', left: '1001px' },
  { nm: '소입현경로당', top: '285px', left: '1198px' },
  { nm: '내금경로당', top: '371px', left: '1324px' },
  { nm: '토촌경로당', top: '264px', left: '1425px' },
  { nm: '대입현경로당', top: '329px', left: '1426px' },
  { nm: '섬호경로당', top: '228px', left: '1539px' },
  { nm: '신촌경로당', top: '430px', left: '889px' },
  { nm: '양지경로당', top: '528px', left: '778px' },
  { nm: '야촌경로당', top: '488px', left: '904px' },
  { nm: '외금경로당', top: '506px', left: '1103px' },
  { nm: '평현경로당', top: '587px', left: '826px' },
  { nm: '봉성경로당', top: '678px', left: '1010px' },
  { nm: '광포경로당', top: '405px', left: '1050px' },
];

export const IDONG_SC_ICON: ScIconItem[] = [
  { nm: '초양경로당', top: '4px', left: '817px' },
  { nm: '초곡경로당', top: '24px', left: '753px' },
  { nm: '광두경로당', top: '22px', left: '903px' },
  { nm: '다정분대경로당', top: '49px', left: '628px' },
  { nm: '초음경로당', top: '44px', left: '803px' },
  { nm: '고모경로당', top: '66px', left: '880px' },
  { nm: '다정경로당', top: '84px', left: '625px' },
  { nm: '금석경로당', top: '79px', left: '698px' },
  { nm: '다천경로당', top: '91px', left: '811px' },
  { nm: '석평경로당', top: '198px', left: '939px' },
  { nm: '정거경로당', top: '211px', left: '1041px' },
  { nm: '난양경로당', top: '189px', left: '1252px' },
  { nm: '무림경로당', top: '247px', left: '1046px' },
  { nm: '장전경로당', top: '246px', left: '1196px' },
  { nm: '난음경로당', top: '254px', left: '1342px' },
  { nm: '문현경로당', top: '289px', left: '1274px' },
  { nm: '성현경로당', top: '321px', left: '1085px' },
  { nm: '봉곡경로당', top: '327px', left: '1156px' },
  { nm: '용소경로당', top: '401px', left: '713px' },
  { nm: '화계경로당', top: '415px', left: '817px' },
  { nm: '신전경로당', top: '422px', left: '1008px' },
  { nm: '금평경로당', top: '487px', left: '1073px' },
  { nm: '원천경로당', top: '605px', left: '912px' },
];

export const SANGJU_SC_ICON: ScIconItem[] = [
  { nm: '벽련경로당', top: '198px', left: '277px' },
  { nm: '두모경로당', top: '313px', left: '318px' },
  { nm: '소량경로당', top: '457px', left: '368px' },
  { nm: '대량경로당', top: '597px', left: '252px' },
  { nm: '금양경로당', top: '411px', left: '990px' },
  { nm: '임촌경로당', top: '460px', left: '1089px' },
  { nm: '상주경로당', top: '497px', left: '1045px' },
  { nm: '금전경로당', top: '544px', left: '954px' },
  { nm: '금포경로당', top: '575px', left: '1560px' },
];

export const SAMDONG_SC_ICON: ScIconItem[] = [
  { nm: '영지경로당', top: '198px', left: '277px' },
  { nm: '수곡음지마을경로당', top: '140px', left: '422px' },
  { nm: '시문경로당', top: '243px', left: '480px' },
  { nm: '고암경로당', top: '188px', left: '530px' },
  { nm: '수장포경로당', top: '83px', left: '549px' },
  { nm: '지족1리경로당', top: '42px', left: '682px' },
  { nm: '지족3리경로당', top: '46px', left: '797px' },
  { nm: '지족2리경로당', top: '56px', left: '763px' },
  { nm: '갈현경로당', top: '257px', left: '735px' },
  { nm: '금송경로당', top: '117px', left: '939px' },
  { nm: '삼화경로당', top: '316px', left: '988px' },
  { nm: '전도경로당', top: '53px', left: '1071px' },
  { nm: '봉화경로당', top: '343px', left: '1109px' },
  { nm: '화암경로당', top: '323px', left: '1220px' },
  { nm: '둔촌경로당', top: '121px', left: '1263px' },
  { nm: '화천경로당', top: '166px', left: '1281px' },
  { nm: '합동경로당', top: '312px', left: '1297px' },
  { nm: '독일마을경로당', top: '390px', left: '1299px' },
  { nm: '금천경로당', top: '163px', left: '1398px' },
  { nm: '내동천경로당', top: '329px', left: '1473px' },
  { nm: '물건경로당', top: '473px', left: '1507px' },
  { nm: '양화금경로당', top: '246px', left: '1678px' },
  { nm: '은점경로당', top: '660px', left: '1617px' },
  { nm: '대지포경로당', top: '856px', left: '1591px' },
  { nm: '내산경로당', top: '821px', left: '927px' },
];

export const MIJO_SC_ICON: ScIconItem[] = [
  { nm: '천하경로당', top: '272px', left: '228px' },
  { nm: '설리경로당', top: '572px', left: '349px' },
  { nm: '송정경로당', top: '264px', left: '524px' },
  { nm: '송남경로당', top: '334px', left: '517px' },
  { nm: '초전경로당', top: '229px', left: '761px' },
  { nm: '답하경로당', top: '612px', left: '746px' },
  { nm: '팔랑경로당', top: '612px', left: '897px' },
  { nm: '미조경로당', top: '437px', left: '976px' },
  { nm: '사항경로당', top: '509px', left: '1103px' },
  { nm: '항도경로당', top: '108px', left: '1115px' },
  { nm: '노구경로당', top: '13px', left: '1240px' },
  { nm: '가인포경로당', top: '67px', left: '1264px' },
  { nm: '조도경로당', top: '915px', left: '1212px' },
];

export const NAM_SC_ICON: ScIconItem[] = [
  { nm: '유구경로당', top: '352px', left: '514px' },
  { nm: '평산1경로당', top: '246px', left: '562px' },
  { nm: '평산2경로당', top: '254px', left: '594px' },
  { nm: '다랭이경로당', top: '270px', left: '577px' },
  { nm: '구미경로당', top: '102px', left: '677px' },
  { nm: '오리경로당', top: '215px', left: '757px' },
  { nm: '북구경로당', top: '102px', left: '931px' },
  { nm: '남구경로당', top: '132px', left: '908px' },
  { nm: '죽전경로당', top: '223px', left: '1054px' },
  { nm: '우형경로당', top: '233px', left: '1129px' },
  { nm: '홍덕경로당', top: '262px', left: '1098px' },
  { nm: '덕월경로당', top: '269px', left: '1078px' },
  { nm: '율곡경로당', top: '290px', left: '1060px' },
  { nm: '당항경로당', top: '231px', left: '1251px' },
  { nm: '두곡경로당', top: '287px', left: '1324px' },
  { nm: '양지경로당', top: '330px', left: '1270px' },
  { nm: '석교경로당', top: '338px', left: '1257px' },
  { nm: '월포경로당', top: '364px', left: '1298px' },
  { nm: '숙호경로당', top: '450px', left: '1290px' },
  { nm: '사촌경로당', top: '527px', left: '548px' },
  { nm: '선구경로당', top: '589px', left: '509px' },
  { nm: '향촌경로당', top: '689px', left: '572px' },
  { nm: '임포경로당', top: '504px', left: '724px' },
  { nm: '운암경로당', top: '499px', left: '760px' },
  { nm: '무지개경로당', top: '565px', left: '1191px' },
  { nm: '홍현1경로당', top: '594px', left: '1371px' },
];

export const SEO_SC_ICON: ScIconItem[] = [
  { nm: '현촌경로당', top: '115px', left: '704px' },
  { nm: '우물경로당', top: '103px', left: '528px' },
  { nm: '중현경로당', top: '174px', left: '518px' },
  { nm: '도산경로당', top: '162px', left: '563px' },
  { nm: '정포마을제1경로당', top: '160px', left: '395px' },
  { nm: '회룡경로당', top: '242px', left: '405px' },
  { nm: '노구경로당', top: '308px', left: '387px' },
  { nm: '유포경로당', top: '356px', left: '358px' },
  { nm: '염해경로당', top: '420px', left: '319px' },
  { nm: '중리경로당', top: '428px', left: '432px' },
  { nm: '남상경로당', top: '452px', left: '462px' },
  { nm: '직장경로당', top: '553px', left: '542px' },
  { nm: '상남경로당', top: '574px', left: '567px' },
  { nm: '예계경로당', top: '632px', left: '823px' },
  { nm: '서상경로당', top: '690px', left: '1010px' },
  { nm: '연죽경로당', top: '359px', left: '1066px' },
  { nm: '대정경로당', top: '495px', left: '1204px' },
  { nm: '서호경로당', top: '526px', left: '1141px' },
  { nm: '남정경로당', top: '534px', left: '1188px' },
  { nm: '금곡경로당', top: '568px', left: '1238px' },
  { nm: '동정경로당', top: '501px', left: '1363px' },
  { nm: '장항경로당', top: '761px', left: '1153px' },
];

export const GOHYEON_SC_ICON: ScIconItem[] = [
  { nm: '차면경로당', top: '267px', left: '481px' },
  { nm: '서갈화경로당', top: '610px', left: '360px' },
  { nm: '동갈화경로당', top: '618px', left: '399px' },
  { nm: '화전경로당', top: '631px', left: '376px' },
  { nm: '북남치경로당', top: '153px', left: '908px' },
  { nm: '동남치경로당', top: '189px', left: '928px' },
  { nm: '대사경로당', top: '302px', left: '910px' },
  { nm: '탑동경로당', top: '329px', left: '864px' },
  { nm: '중앙경로당', top: '336px', left: '828px' },
  { nm: '방월경로당', top: '332px', left: '773px' },
  { nm: '천동경로당', top: '376px', left: '819px' },
  { nm: '포상경로당', top: '402px', left: '835px' },
  { nm: '선원경로당', top: '433px', left: '858px' },
  { nm: '관당경로당', top: '305px', left: '1036px' },
  { nm: '오곡경로당', top: '454px', left: '1042px' },
  { nm: '도산경로당', top: '438px', left: '1169px' },
  { nm: '성산경로당', top: '384px', left: '1260px' },
  { nm: '동도마경로당', top: '457px', left: '1413px' },
  { nm: '도마경로당', top: '467px', left: '1383px' },
  { nm: '서도마경로당', top: '493px', left: '1352px' },
  { nm: '대곡경로당', top: '540px', left: '1379px' },
  { nm: '대계경로당', top: '639px', left: '1249px' },
  { nm: '이어제2경로당', top: '554px', left: '1640px' },
  { nm: '풍산경로당', top: '596px', left: '1644px' },
];

export const SEOL_SC_ICON: ScIconItem[] = [
  { nm: '월곡경로당', top: '113px', left: '443px' },
  { nm: '감암경로당', top: '40px', left: '569px' },
  { nm: '노량경로당', top: '24px', left: '704px' },
  { nm: '덕신경로당', top: '127px', left: '663px' },
  { nm: '용강경로당', top: '156px', left: '907px' },
  { nm: '왕지경로당', top: '73px', left: '1121px' },
  { nm: '동흥경로당', top: '176px', left: '1303px' },
  { nm: '문의경로당', top: '206px', left: '1247px' },
  { nm: '봉우경로당', top: '198px', left: '1400px' },
  { nm: '남양경로당', top: '232px', left: '1278px' },
  { nm: '금음경로당', top: '316px', left: '1267px' },
  { nm: '옥동경로당', top: '351px', left: '1394px' },
  { nm: '문항경로당', top: '409px', left: '1390px' },
  { nm: '모천경로당', top: '551px', left: '1304px' },
  { nm: '고사경로당', top: '644px', left: '1240px' },
  { nm: '진목경로당', top: '729px', left: '1108px' },
  { nm: '동비경로당', top: '810px', left: '832px' },
  { nm: '정태경로당', top: '738px', left: '659px' },
  { nm: '내곡경로당', top: '735px', left: '716px' },
];

export const CHANGSON_SC_ICON: ScIconItem[] = [
  { nm: '신흥경로당', top: '403px', left: '237px' },
  { nm: '사포경로당', top: '347px', left: '226px' },
  { nm: '광천경로당', top: '278px', left: '254px' },
  { nm: '보천경로당', top: '190px', left: '455px' },
  { nm: '서대경로당', top: '123px', left: '687px' },
  { nm: '고순경로당', top: '94px', left: '743px' },
  { nm: '율도경로당', top: '71px', left: '803px' },
  { nm: '대벽경로당', top: '61px', left: '841px' },
  { nm: '소벽경로당', top: '31px', left: '1019px' },
  { nm: '단항경로당', top: '92px', left: '1066px' },
  { nm: '냉천경로당', top: '133px', left: '946px' },
  { nm: '당항경로당', top: '204px', left: '839px' },
  { nm: '곤유경로당', top: '290px', left: '736px' },
  { nm: '동대경로당', top: '333px', left: '741px' },
  { nm: '상신경로당', top: '367px', left: '692px' },
  { nm: '상죽경로당', top: '408px', left: '557px' },
  { nm: '옥천경로당', top: '516px', left: '413px' },
  { nm: '지족경로당', top: '395px', left: '739px' },
  { nm: '수산경로당', top: '464px', left: '703px' },
  { nm: '당저1경로당', top: '504px', left: '688px' },
  { nm: '당저2경로당', top: '463px', left: '819px' },
  { nm: '부윤1경로당', top: '537px', left: '936px' },
  { nm: '물미경로당', top: '375px', left: '976px' },
  { nm: '오용경로당', top: '260px', left: '988px' },
  { nm: '식포경로당', top: '192px', left: '1133px' },
  { nm: '언포경로당', top: '221px', left: '1139px' },
  { nm: '고두경로당', top: '344px', left: '1094px' },
  { nm: '천포경로당', top: '285px', left: '1189px' },
  { nm: '적량경로당', top: '454px', left: '1278px' },
  { nm: '대곡경로당', top: '512px', left: '1186px' },
  { nm: '장포경로당', top: '620px', left: '1256px' },
];

// ─── 지역별 패널 설정 ──────────────────────────────────────
export interface PanelConfig {
  left: string;
  top: string;
  back: string;
  subBack: string;
  subScList: ScIconItem[];
}

export const NAMHAE_PANEL: Record<string, PanelConfig> = {
  all: { left: '0px', top: '0px', back: '', subBack: '', subScList: [] },
  '401': {
    left: '608px', top: '223px',
    back: HOME_MAP.PANEL.BACK.NAMHAE,
    subBack: HOME_MAP.SUB.BACK.NAMHAE,
    subScList: NAMHAE_SC_ICON,
  },
  '402': {
    left: '865px', top: '354px',
    back: HOME_MAP.PANEL.BACK.IDONG,
    subBack: HOME_MAP.SUB.BACK.IDONG,
    subScList: IDONG_SC_ICON,
  },
  '403': {
    left: '1015px', top: '542px',
    back: HOME_MAP.PANEL.BACK.SANGJU,
    subBack: HOME_MAP.SUB.BACK.SANGJU,
    subScList: SANGJU_SC_ICON,
  },
  '404': {
    left: '1229px', top: '380px',
    back: HOME_MAP.PANEL.BACK.SAMDONG,
    subBack: HOME_MAP.SUB.BACK.SAMDONG,
    subScList: SAMDONG_SC_ICON,
  },
  '405': {
    left: '1369px', top: '615px',
    back: HOME_MAP.PANEL.BACK.MIJO,
    subBack: HOME_MAP.SUB.BACK.MIJO,
    subScList: MIJO_SC_ICON,
  },
  '406': {
    left: '465px', top: '483px',
    back: HOME_MAP.PANEL.BACK.NAM,
    subBack: HOME_MAP.SUB.BACK.NAM,
    subScList: NAM_SC_ICON,
  },
  '407': {
    left: '273px', top: '240px',
    back: HOME_MAP.PANEL.BACK.SEO,
    subBack: HOME_MAP.SUB.BACK.SEO,
    subScList: SEO_SC_ICON,
  },
  '408': {
    left: '456px', top: '77px',
    back: HOME_MAP.PANEL.BACK.GOHYEON,
    subBack: HOME_MAP.SUB.BACK.GOHYEON,
    subScList: GOHYEON_SC_ICON,
  },
  '409': {
    left: '706px', top: '52px',
    back: HOME_MAP.PANEL.BACK.SEOL,
    subBack: HOME_MAP.SUB.BACK.SEOL,
    subScList: SEOL_SC_ICON,
  },
  '410': {
    left: '1054px', top: '136px',
    back: HOME_MAP.PANEL.BACK.CHANGSON,
    subBack: HOME_MAP.SUB.BACK.CHANGSON,
    subScList: CHANGSON_SC_ICON,
  },
};

// ─── 센서 패널 목록 ──────────────────────────────────────
export interface SensorPanelItem {
  nm: string;
  margin: string;
  icon: string;
}

export const SENSOR_PANEL: Record<string, SensorPanelItem> = {
  '01': { nm: '비상벨',    margin: '37px', icon: HOME_MAP.SUB.PANEL.SENSOR.BELL },
  '02': { nm: '화재 센서', margin: '22px', icon: HOME_MAP.SUB.PANEL.SENSOR.FIRE },
  '04': { nm: '셋톱 박스', margin: '22px', icon: HOME_MAP.SUB.PANEL.SENSOR.SETTOP },
  '05': { nm: 'CCTV',      margin: '36px', icon: HOME_MAP.SUB.PANEL.SENSOR.CCTV },
};

export const SENSOR_PANEL_LIST: SensorPanelItem[] = [
  SENSOR_PANEL['01'],
  SENSOR_PANEL['02'],
  SENSOR_PANEL['04'],
  SENSOR_PANEL['05'],
];
