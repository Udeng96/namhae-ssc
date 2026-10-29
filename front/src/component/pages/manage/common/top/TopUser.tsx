import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useCommonStore } from '@/component/stores/commonStore';
import { fetchLogout } from '@/component/api/userApi';
import UserImg from '@/assets/images/dark/common/img/img_top_porfile_ex.svg';

const TopUser = () => {
  const userInfo = useCommonStore((state) => state.userInfo);

  const { mutate: logout } = useMutation({
    mutationFn: () => fetchLogout(userInfo?.token ?? ''),
    onSuccess: (res) => {
      // 스토리지 정리
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');

      // 쿠키 정리 — 서버 Set-Cookie 가 잡지 못한 path 잔재 대비 (예: refac 이전 /ssc/sc).
      // 이름 × path 후보군 전체에 만료 cookie 를 박는다.
      // 브라우저는 Cookie: 헤더에 path 를 안 보내므로 (RFC 6265),
      // 정확한 path 를 모를 때는 후보군 모두에 대해 만료를 시도하는 수밖에 없다.
      const TOKEN_NAMES = ['token', 'TOKEN', '_TOKEN_', '_TO_KEN_'];
      const TOKEN_PATHS = ['/', '/ssc', '/ssc/sc', '/sc', '/sc/mng', '/oms'];
      TOKEN_NAMES.forEach((name) => {
        TOKEN_PATHS.forEach((path) => {
          document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
      });

      if (res.data) window.location.href = res.data;
    },
  });

  return (
    <>
      <StyledTopUser>
        <StyledUserImg />
        <StyledUserName>
          <span>{userInfo?.userName ?? '미등록자'}</span>님 환영합니다.
        </StyledUserName>
      </StyledTopUser>
      <StyledLogoutBtn onClick={() => logout()}>로그아웃</StyledLogoutBtn>
    </>
  );
};

export default TopUser;

const StyledTopUser = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;

  &:after {
    content: '';
    display: inline-block;
    width: 1px;
    height: 22px;
    background: #2a2e54;
  }
`;

const StyledUserImg = styled.i`
  display: inline-block;
  width: 28px;
  height: 28px;
  margin-right: 10px;
  background-size: 100%;
  background-image: url('${UserImg}');
`;

const StyledUserName = styled.p`
  padding-right: 32px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);

  span {
    padding-right: 5px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
`;

const StyledLogoutBtn = styled.button`
  display: flex;
  width: 81px;
  height: 36px;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #dfe1e8;
  border-radius: 18px;
  border: 1px solid #393d66;
  background: #2a2e54;
  cursor: pointer;

  &:hover {
    border-color: #54598c;
    background-color: #40446e;
  }
`;
