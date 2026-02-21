import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MeView from '../views/Me/MeView';
import {getUserByNumber, listenToUserInfoByNumber} from "../firebase/db.js";
import LoadingIndicator from "../components/LoadingIndicator.jsx";

const MePresenter = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [userInfo, setUserInfo] = useState(null);

  const params = useParams();
    const userNumber = parseInt(params.userNumber, 10);

  useEffect(() => {
    const unsubscribe = listenToUserInfoByNumber(userNumber, (data) => {
      if (data) setUserInfo(data);
    });

    return () => unsubscribe(); // 清理监听器
  }, [userNumber]);


  if (!userInfo) {
    return <LoadingIndicator />;
  }

  return (
    <MeView
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userInfo={userInfo}
    />
  );
};

export default MePresenter;
