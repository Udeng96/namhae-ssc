import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ManageRoot from './pages/manage/ManageRoot';

// Social — refac 완료
import SocialRoot from './pages/social/SocialRoot';
// Noti — refac 완료
import NotiRoot from './pages/noti/NotiRoot';

const Router = () => {
  return (
    <BrowserRouter basename="/ssc">
      <Routes>
        <Route path="/sc/mng" element={<ManageRoot />} />
        <Route path="/sc/social/*" element={<SocialRoot />} />
        <Route path="/sc/noti/*" element={<NotiRoot />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
