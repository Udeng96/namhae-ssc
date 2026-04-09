import styled from 'styled-components';
import SocialWeather from './SocialWeather';
import SocialDate from './SocialDate';

const SocialHead = () => {
  return (
    <StyledSocialHead>
      <SocialWeather />
      <SocialDate />
    </StyledSocialHead>
  );
};

export default SocialHead;

const StyledSocialHead = styled.div`
  display: flex;
  align-items: end;
  width: 100%;
  height: 180px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;
