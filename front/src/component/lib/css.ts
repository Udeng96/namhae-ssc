import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { ANI_KEYFRAME, MODAL_IMAGE, RESULT_IMAGE, TOAST_IMAGE } from '@/component/lib/constImage';
import { css } from 'styled-components';

export const CommonContainer = `
    position: absolute;
    width : calc(100% - 60px);
    height : 100%;
    top: 48px;
    right: 0;
`

export const CommonScrollBox = `
    overflow: hidden;
    overflow-y: auto;
`

export const CommonScrollBar = `
    &::-webkit-scrollbar {
        width: 4px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background-color: #4C5580;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #747DA6;
    }

    &::-webkit-scrollbar-track {
        border-radius: 20px;
        background-color: #0C0922;
    }
`

export const CommonBox = `
    padding: 36px 0 42px;
    position: absolute;
    height: calc(100% - 48px);
    background: #0F1223;
    width: 532px;
    z-index:100;
    transition : left 550ms ease;
`

export const CommonBoxDimmed = `
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    opacity: 0;
    transition: visibility 250ms 450ms;
`

export const CommonRightBoxOpen = `
    right: 0px;
`

export const CommonRightBoxCls = `
    right: -482px;
`

export const CommonBoxOpen = `
    left: 60px;
`

export const CommonBoxCls = `
    left:-472px;
`

export const CommonBoxBtn = `
    background-repeat: no-repeat;
    background-size: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 25px;
    height: 54px;
`

export const CommonBoxBtnLeft = `
    background-image: url("${EVENT_IMAGE.CONTENT.BTN.LEFT.OPEN.NORMAL}");
    &:hover{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.LEFT.OPEN.HOVER}"); }
    &:active{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.LEFT.OPEN.ACTIVE}"); }
`

export const CommonBoxBtnLeftCls = `
    background-image: url("${EVENT_IMAGE.CONTENT.BTN.LEFT.CLS.NORMAL}");
    &:hover{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.LEFT.CLS.HOVER}"); }
    &:active{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.LEFT.CLS.ACTIVE}"); }
`

export const CommonBoxBtnRight = `
    background-image: url("${EVENT_IMAGE.CONTENT.BTN.RIGHT.OPEN.NORMAL}");
    &:hover{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.RIGHT.OPEN.HOVER}"); }
    &:active{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.RIGHT.OPEN.ACTIVE}"); }
`

export const CommonBoxBtnRightCls = `
    background-image: url("${EVENT_IMAGE.CONTENT.BTN.RIGHT.CLS.NORMAL}");
    &:hover{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.RIGHT.CLS.HOVER}"); }
    &:active{ background-image: url("${EVENT_IMAGE.CONTENT.BTN.RIGHT.CLS.ACTIVE}"); }
`

export const EventListItem = `
    display: flex;
    height: 29px;
    padding: 0 6px;
    line-height: 29px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 13px;

     &:nth-child(1){
        width: 21px;
    }

    &:nth-child(2){
        width: 58px;
    }

    &:nth-child(3) {
        width: 61px;
        justify-content: center;
        padding-left:21px;
    }

    &:nth-child(4){
        width: 136px;
        padding-left: 25px;
    }

    &:nth-child(5){
        width: 112px;
    }

    &:nth-child(6){
        width: 29px;
        padding: 0;
    }
`

export const CommonSkeleton = `
    color: #F2F4FC;
    font-size: 13px;
    border-radius: 8px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    over-flow: hidden;
`

export const CommonSkeletonItem = css`
    animation: ${ANI_KEYFRAME.EVENT.SKELETON} 3500ms ease-in-out infinite;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 39px;
    padding: 4px 7px;
    border-radius: 7px;
    background: #1A203A;
    cursor: pointer;
    margin-top: 3px;
    width: 100%;
    border-color: #2A2E54;
    pointer-events: none;
    background-image: linear-gradient(-45deg, #202854 30%, #313B70 40%, #313B70 41%, #202854 50%);
    background-size: 300% 100%;
`

export const CommonNone = `
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #F2F4FC;
    font-size: 13px;
    border-radius: 8px;
    border: 1px solid #543FAF;
    background: #090C1C;
    i{
        display: inline-block;
        width: 100px;
        height: 80px;
        margin-bottom: 13px;
        background : url("${RESULT_IMAGE.NONE.IMG}") no-repeat center/100%;
    }

    p{
        line-height: 1.66;
    }
`

export const CommonError = `
 color: #F2F4FC;
    font-size: 13px;
    border-radius: 8px;
    border: 1px solid #543FAF;
    background: #090C1C;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    p{
        line-height: 1.66;
    }
`

export const CommonErrorBtn = `
    position: relative;
    width: 32px;
    height: 32px;
    margin-bottom: 28px;
    background: url("${RESULT_IMAGE.ERROR.RELOAD.BASE}") no-repeat center/100%;

    &:after{
        content: "Reload";
        position: absolute;
        top: 37px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: 300;
        color: #7A45FF;
    }

    &:hover{
        background: url("${RESULT_IMAGE.ERROR.RELOAD.HOVER}") no-repeat center/100%;
    }

    &:active{
        background: url("${RESULT_IMAGE.ERROR.RELOAD.ACTIVE}") no-repeat center/100%;
    }
 `

export const CommonDropBtn = `
    width: 28px;
    height: 28px;
    margin-left: auto;
    background: url("${EVENT_IMAGE.CONTENT.SEARCH.DROP.BASE}") no-repeat center / 100%;

    &:hover{
        background: url("${EVENT_IMAGE.CONTENT.SEARCH.DROP.HOVER}");
    }
`

export const CommonUpBtn = `
    width: 28px;
    height: 28px;
    margin-left: auto;
    background: url("${EVENT_IMAGE.CONTENT.SEARCH.DROP.BASE}") no-repeat center / 100%;
    transform : rotate(180deg);
    &:hover{
        background: url("${EVENT_IMAGE.CONTENT.SEARCH.DROP.HOVER}");
    }
`

export const CommonSearchBtn = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 36px;
    border-radius: 18px;
    border: 1px solid #7C6EFC;
    background: linear-gradient(180deg, #7F7AFF 0%, #681CEB 100%);

    i {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 3px;
        background-size: 100%;
        background-image: url("${EVENT_IMAGE.CONTENT.SEARCH.BTN}");
    }

    &:hover {
        border-color: #A69DF9;
        background: linear-gradient(180deg, #8985FF 0%, #7D36F7 100%);
    }
`

export const CommonSearchSelectBox = `
    position: absolute;
    top: calc(100% + 3px);
    width: 100%;
    border-radius: 6px;
    border: 1px solid #7A45FF;
    background: #19133B;
`

export const CommonSearchTokenBox = `
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 6px;
`

export const CommonSearchSelectClsBtnArea = `
    width: 100%;
    border-radius: 0px 0px 6px 6px;
    border-top: 1px solid #7A45FF;
    background: #19133B;
    height:  58px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding : 10px 15px 15px 15px;
`

export const CommonSearchSelectClsBtn = `
display: flex;
    width: 100%;
    height: 34px;
    padding: 10px 31px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #CFCFE5;

    text-align: center;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;

    border-radius: 6px;
    border: 1px solid #3D3568;

    background: #2B2454;

    &:hover {
        border: 1px solid #655F8A;
        background: #3D3568;
        cursor: pointer;
    }
`

export const CommonScheSelectBox = `
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    p{
        margin: 0 8px;
        font-size: 20px;
        color: #BCBFCC;
    }
`

export const CommonScheSelectBtn = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 36px;
    overflow: hidden;
    border-radius: 6px;
    text-overflow: ellipsis;
    white-space: nowrap;

`

export const CommonToast = `
    display: flex;
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
    justify-content: center;
    padding: 15px 15px 15px 23px;
    border-radius: 6px;
    background: linear-gradient(0deg, #0F1223 0%, #0F1223 100%), #1A203A;
    box-shadow: 0px 7px 9px 0px rgba(0, 0, 0, 0.32);
    z-index: 1000;

    p {
        color: #fff;
        font-size: 19px;
    }
`

export const CommonToastShow = `
    opacity : 1;
    transition: opacity 250ms;
    visibility: visible;
`

export const CommonToastHide = `
    opacity : 0;
    transition: visibility 1ms 450ms, opacity 450ms;
    visibility: hidden;
`

export const CommonToastClsBtn = `
    width: 24px;
    height: 24px;
    margin-left: 10px;
    background: url(${TOAST_IMAGE.CLS.BASE}) no-repeat center/100%;

    &:hover {
        background: url(${TOAST_IMAGE.CLS.HOVER}) no-repeat center/100%;
    }
`

export const CommonToastIconNorm = `
    display: inline-block;
    width: 26px;
    height: 26px;
    margin-right: 9px;
    background: url(${TOAST_IMAGE.ICON.NORM}) no-repeat center 100%;
`

export const CommonToastIconWarn = `
    display: inline-block;
    width: 26px;
    height: 26px;
    margin-right: 9px;
    background: url(${TOAST_IMAGE.ICON.WARN}) no-repeat center 100%;
`

export const CommonModal = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1004;
`

export const CommonModalDimmed = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
`

export const CommonModalWrap = `
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
`

export const CommonModalShow = `
    visibility: visible;
    opacity: 1;
    transition: opacity 450ms;
`

export const CommonModalHide = `
    visibility: hidden;
    opacity: 0;
    transition: visibility 350ms 350ms, opacity 250ms;
`

export const CommonModalClsBtn = `
    width: 30px;
    height: 30px;
    margin-left: auto;
    background : url("${MODAL_IMAGE.CLS.BASE}") no-repeat center / 100%;

    &:hover{
        background : url("${MODAL_IMAGE.CLS.HOVER}") no-repeat center / 100%;
        cursor: pointer;
    }
`

export const CommonPageBtn = `
      border-radius: 0;
      border: none;
      background-size: 100%;
      background-repeat: no-repeat;
      width: 19px;
      height: 19px;
      font-size: 10px;
      font-weight: 500;
      color: #F2F4FC;
`

export const CommonFormBox = `
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    + div {
        margin-top: 16px;
    }
`

export const CommonFormBoxNm = `
    display: flex;
    width: 78px;
    padding-top: 13px;
    font-size: 13px;
    color: #F2F4FC;
`

export const CommonFormBoxVal = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px 0;
    position: relative;
    width: 345px;
`

export const CommonFormBoxValBox = `
    position: relative;
    width: 100%;
`

export const CommonFormBoxValDisabled = `
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background: #1A1B2D;
    opacity: 0.5;
    cursor : not-allowed;
    z-index: 2;
`

export const CommonScheSelectList = `
    position: absolute;
    top: 100%;
    width: 100%;
    margin-top: 3px;
    padding: 5px 7px 5px 5px;
    font-size: 12px;
    font-weight: 300;
    border: solid 1px #7A45FF;
    background-color: #1A203A;
    overflow: hidden;
    border-radius: 6px;
    z-index: 3;
`

export const CommonChartBox = `
    border-radius: 12px;
    border: 1px solid #2A2E54;
    background: #1A203A;
    position: relative;
    height: 230px;
    padding: 20px 40px 20px 32px;

    &:before{
        content: "";
        display: block;
        position: absolute;
        left: 0;
        width: 4px;
        height: 17px;
        border-radius: 0px 2px 2px 0px;
        background: linear-gradient(180deg, #7F7AFF, #681CEB);
        box-shadow: 4px 0px 5px 0px rgba(111, 57, 241, 0.33);
    }

    h3{
        font-size: 16px;
        font-weight: 500;
        color: #F2F4FC;
    }
`

export const CommonLegend = `
    display: flex;
    flex-direction: column;
    gap: 0 16px;
    position: absolute;
    left: -49px;
    bottom: -45px;
    transition: right 450ms;
    width: auto;
    height: auto;
    padding: 16px 20px;
    border-radius: 12px;
    border: 1px solid rgb(47, 51, 87);
    background: rgb(25, 30, 52);

    p{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 11px;
        font-size: 12px;
        color: rgb(255, 255, 255);
    }
`

export const CommonLegendBox = `
    display: flex;
    flex-direction: column;
    gap: 10px 0px;
    padding: 0px 2px;

    li{
        display: flex;
        align-items: center;
        gap: 0px 8px;
    }
`

export const CommonLegendColor = `
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
`

export const CommonLegendVal = `
    color: rgb(255, 255, 255);
    font-size: 12px;
    font-weight: 300;
`

export const CommonPlayerBox = `
    position: absolute;
    width: 384px;
    height: 216px;
    border-radius: 8px;
    border: 2px solid;
    overflow: hidden;
    background: linear-gradient(180deg, #0C1124 0%, #161C36 100%);
    border-color: #C01D2A;
    z-index: 1899;
    right: 250px;
    bottom : 90px;

    &:nth-child(2){
     right: 250px;
     bottom : -179px;
    }

    &:nth-child(3){
      right: -539px;
      bottom : 90px;
    }

    &:nth-child(4){
      right: -539px;
      bottom : -179px;
    }
`

export const CommonPlayerFacBox = `
    position: absolute;
    width: 384px;
    height: 216px;
    border-radius: 8px;
    border: 2px solid;
    overflow: hidden;
    background: linear-gradient(180deg, #0C1124 0%, #161C36 100%);
    border-color: #C01D2A;
    z-index: 1899;
    right: 40px;
    bottom : 90px;

    &:nth-child(2){
      right: 40px;
      bottom : -270px;
    }

    &:nth-child(3){
      right: -390px;
      bottom : 90px;
    }

    &:nth-child(4){
      right: -390px;
      bottom : -279px;
    }
`

export const CommonPlayerCrimeBox = `
    position: absolute;
    width: 384px;
    height: 216px;
    border-radius: 8px;
    border: 2px solid;
    overflow: hidden;
    background: linear-gradient(180deg, #0C1124 0%, #161C36 100%);
    border-color: #424550;
    z-index: 1005;
    right: 260px;
    bottom : -510px;

`

export const CommonPlayerIndex = `
        position: absolute;
        top: -1px;
        right: -1px;
        width: 34px;
        height: 30px;
        color: #FFF;
        font-size: 16px;
        font-weight: 800;
        text-align: center;
        line-height: 30px;
        border-radius: 0px 0px 0px 6px;
        border: 1px solid;
        border-color: #C01D2A;
        background-color: #F73942;
        z-index : 300;
`

export const CommonPlayerNm = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    padding: 5px 8px 5px 14px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 59.23%, rgba(102, 102, 102, 0) 91.12%);

   p{
        width: 325px;
        color: #fff;
        font-size: 13px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
`

export const CommonPlayerBtn = `
   width: 20px;
   height: 20px;
   cursor: pointer;
`
