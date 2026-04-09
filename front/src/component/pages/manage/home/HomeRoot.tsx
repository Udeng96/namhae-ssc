import styled from 'styled-components';
import HomeHeader from './HomeHeader';
import HomeMenu from './HomeMenu';
import HomeBody from './HomeBody';
import HomeSubBody from './sub/HomeSubBody';

interface Props {
  isShow: boolean;
}

const HomeRoot = ({ isShow }: Props) => {
  return (
    <StyledHome $isShow={isShow}>
      <HomeHeader />
      <HomeMenu />
      <HomeBody />
      <HomeSubBody />
    </StyledHome>
  );
};

export default HomeRoot;

const StyledHome = styled.section<{ $isShow: boolean }>`
  display: ${({ $isShow }) => ($isShow ? 'block' : 'none')};
  position: absolute;
  width: calc(100% - 60px);
  height: 100%;
  top: 48px;
  right: 0;
`;
