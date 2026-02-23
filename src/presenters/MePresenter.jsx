import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import MeView from '../views/Me/MeView';
import { listenToUserInfoByNumber } from "../firebase/db.js";
import LoadingIndicator from "../components/LoadingIndicator.jsx";

const MePresenter = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [userInfo, setUserInfo] = useState(null);

  const params = useParams();
  const userNumber = parseInt(params.userNumber, 10);

  useEffect(() => {
    const unsubscribe = listenToUserInfoByNumber(userNumber, (data) => {
      if (data) {
        setUserInfo(prev => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          return data;
        });
      }
    });

    return () => unsubscribe(); // Clean up listener
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
