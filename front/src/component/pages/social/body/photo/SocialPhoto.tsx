import styled from 'styled-components';
import PhotoNone from './PhotoNone';
import PhotoSche from './PhotoSche';
import PhotoVms from './PhotoVms';
import PhotoNorm from './PhotoNorm';
import PhotoEmer from './PhotoEmer';

const SocialPhoto = () => {
  return (
    <StyledPhoto>
      <PhotoNone />
      <PhotoSche />
      <PhotoVms />
      <PhotoNorm />
      <PhotoEmer />
    </StyledPhoto>
  );
};

export default SocialPhoto;

const StyledPhoto = styled.div`
  width: 100%;
  height: 1131px;
  position: relative;
`;
