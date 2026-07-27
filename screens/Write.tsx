import styled from "styled-components/native";
import colors from "../colors";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { DBContext, useDB } from "../context";
import { useNavigation } from "@react-navigation/native";
import {
  InterstitialAd,
  TestIds,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

const Container = styled.View`
  background-color: ${colors.bgColor};
  flex: 1;
  padding: 0px 30px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  margin: 50px 0;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
`;
const TextInput = styled.TextInput`
  background-color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 18px;
`;
const Btn = styled.TouchableOpacity`
  width: 100%;
  margin-top: 30px;
  background-color: ${colors.btnColor};
  padding: 10px 20px;
  align-items: center;
  border-radius: 20px;
`;
const BtnText = styled.Text`
  color: white;
  font-weight: 500;
  font-size: 18px;
`;
const Emotions = styled(FlatList<string>)`
  /* flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px; */
  max-height: 80px; /* 💡 리스트 전체의 최대 높이를 잡아줍니다 */
  margin-bottom: 10px;
`;
const Emotion = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: white;
  elevation: 5;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  justify-content: center;
  align-items: center;
  height: 60px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ selected }) =>
    selected ? "rgba(0, 0, 0, 0.5)" : "transparent"};
`;
const EmotionText = styled.Text`
  font-size: 24px;
`;

const AdBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 70px;
  right: 30px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  elevation: 5;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`;
const AdBtnText = styled.Text`
  color: white;
`;
const emotions = ["🤯", "🥲", "🤬", "🤗", "🥰", "😊", "🤩"];
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const rewarded = RewardedAd.createForAdRequest(adUnitId);
const Write = () => {
  const db = useDB();
  const navigation = useNavigation();

  const [selectedEmotion, setEmotion] = useState<null | string>(null);
  const [feelings, setFeelings] = useState("");
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  //Interstitial Ads
  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        navigation.goBack();
        interstitial.load();
      }
    );
    interstitial.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);
  //Rewarded AD
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setRewardedLoaded(true);
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => console.log("User earned reward of ", reward)
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setRewardedLoaded(false);
        rewarded.load();
      }
    );
    rewarded.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, []);
  const onChangeText = (text: string) => setFeelings(text);
  const onEmotionPress = (face: string) => setEmotion(face);
  const onSubmit = async () => {
    if (feelings === "" || selectedEmotion === null) {
      return Alert.alert("Please complete form.");
    }
    if (!db) {
      console.log("DB 객체가 없습니다!");
      return;
    }
    try {
      console.log("저장 시도 중...", Date.now(), selectedEmotion, feelings);
      await db.runAsync(
        `INSERT INTO feelings (id, emotion, message) VALUES (?, ?, ?)`,
        Date.now(),
        selectedEmotion,
        feelings
      );
      if (interstitialLoaded) {
        interstitial.show();
      } else {
        navigation.goBack();
      }
      // console.log("저장 성공 결과:", result);
    } catch (error) {
      console.log("저장 오류:", error);
    } finally {
      setEmotion(null);
      setFeelings("");
    }
  };
  // console.log(feelings, selectedEmotion);
  return (
    <Container>
      <Title>How do you feel today?</Title>
      <Emotions
        horizontal
        data={emotions}
        contentContainerStyle={{
          gap: 10,
          paddingVertical: 10,
        }}
        renderItem={({ item }) => (
          <Emotion
            selected={item === selectedEmotion}
            onPress={() => onEmotionPress(item)}
          >
            <EmotionText>{item}</EmotionText>
          </Emotion>
        )}
      ></Emotions>
      <TextInput
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        onChangeText={onChangeText}
        value={feelings}
        placeholder="Write your feelings..."
      />
      <Btn onPress={onSubmit}>
        <BtnText>Save</BtnText>
      </Btn>
      <AdBtn
        onPress={() => {
          if (rewardedLoaded) {
            rewarded.show();
          } else {
            Alert.alert(
              "광고가 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요!"
            );
          }
        }}
      >
        <AdBtnText>
          {rewardedLoaded ? "보상형 광고 보고 코인 받기 🎁" : "광고 로딩 중..."}
        </AdBtnText>
      </AdBtn>
    </Container>
  );
};
export default Write;
