import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { CommonScrollBar } from '@/component/lib/css';
import { useCommonStore } from '@/component/stores/commonStore';
import { SysType } from '@/component/types/common';
import { BASE_URL_EXTERNAL } from '@/component/lib/urls';
import DropBase from '@/assets/images/dark/common/btn/btn_dropdown_arrow_normal.svg';
import DropHover from '@/assets/images/dark/common/btn/btn_dropdown_arrow_hover.svg';

const TopPlatform = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const token = sessionStorage.getItem('token');
  const platformList = useCommonStore((state) => state.sysInfos);

  const [selected, setSelected] = useState<SysType>({ sysName: '', url: '' });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (platformList.length > 0) setSelected(platformList[0]);
  }, [platformList]);

  const handleItem = (item: SysType) => {
    let url = item.url;
    if (item.url.includes('http://')) {
      const ip = item.url.replace('http://', '').split('/')[0];
      url = item.url.replace(`http://${ip}/`, '');
    } else {
      url = BASE_URL_EXTERNAL + item.url;
    }
    if (formRef.current) {
      formRef.current.action = url;
      formRef.current.submit();
    }
    setIsOpen(false);
  };

  return (
    <StyledPlatform>
      <StyledBox>
        <form ref={formRef}>
          <input type="hidden" name="token" value={token ?? ''} />
        </form>
        <StyledDropBtn $isOpen={isOpen} onClick={() => setIsOpen((v) => !v)}>
          {selected.sysName}
        </StyledDropBtn>
        <StyledDropBox $isOpen={isOpen}>
          <StyledScroll>
            <StyledList>
              {platformList.map((item, i) => (
                <StyledItem
                  key={i}
                  $isSelect={selected.sysName === item.sysName}
                  onClick={() => handleItem(item)}
                >
                  <button>{item.sysName}</button>
                </StyledItem>
              ))}
            </StyledList>
          </StyledScroll>
        </StyledDropBox>
      </StyledBox>
    </StyledPlatform>
  );
};

export default TopPlatform;

const StyledPlatform = styled.div`
  margin-left: auto;
  margin-right: 48px;
`;

const StyledBox = styled.div`
  display: inline-block;
  position: relative;
`;

const StyledDropBtn = styled.button<{ $isOpen: boolean }>`
  width: 170px;
  height: 36px;
  padding: 5px 30px 5px 10px;
  text-align: left;
  font-size: 12px;
  font-weight: 300;
  color: #fff;
  border: solid 1px ${({ $isOpen }) => ($isOpen ? '#7A45FF' : '#3E4165')};
  background-color: ${({ $isOpen }) => ($isOpen ? '#1A203A' : '#12172E')};
  border-radius: 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 28px;
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    border-radius: 5px;
    background-image: url('${DropBase}');
    background-repeat: no-repeat;
    background-position: center;
  }

  &:hover::before {
    background-image: url('${DropHover}');
  }
`;

const StyledDropBox = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  width: 100%;
  margin-top: 3px;
  padding: 5px 7px 5px 5px;
  font-size: 12px;
  font-weight: 300;
  border: solid 1px #7a45ff;
  background-color: #1a203a;
  overflow: hidden;
  border-radius: 6px;
  z-index: 3;
`;

const StyledScroll = styled.div`
  height: 165px;
  padding-right: 8px;
  overflow: hidden;
  overflow-y: auto;
  ${CommonScrollBar}
`;

const StyledList = styled.ul`
  list-style: none;

  * {
    border-radius: 4px;
  }
`;

const StyledItem = styled.li<{ $isSelect: boolean }>`
  border-radius: 4px;
  background-color: ${({ $isSelect }) => ($isSelect ? '#7A34FF' : 'transparent')};
  cursor: ${({ $isSelect }) => ($isSelect ? 'default' : 'pointer')};

  &:hover {
    background-color: #2a2e54;
  }

  + li {
    margin-top: 3px;
  }

  button {
    width: 100%;
    height: 31px;
    padding: 0 11px;
    font-size: inherit;
    font-weight: inherit;
    color: #fff;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;
