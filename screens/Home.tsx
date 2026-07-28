import styled from "styled-components/native";
import colors from "../colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDB } from "../context";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
} from "react-native";
import {
  AppOpenAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";

const Container = styled.View`
  flex: 1;
  padding: 100px 30px 0 30px;
  background-color: ${colors.bgColor};
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
`;

const Btn = styled.TouchableOpacity`
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

const BtnText = styled.Text`
  color: white;
`;
const ListContainer = styled.View`
  flex: 1;
`;
const RecordContainer = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  padding: 10px 20px;
  border-radius: 10px;

  align-items: center;
  justify-content: space-between;
`;
const Record = styled.View`
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;
const Emotion = styled.Text`
  font-size: 24px;
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Btns = styled.View`
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;
const Separator = styled.View`
  height: 10px;
`;
const BannerContainer = styled.View`
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;
interface Feeling {
  id: number;
  emotion: string;
  message: string;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const Home = ({ navigation: { navigate } }: any) => {
  const db = useDB();
  const isFocused = useIsFocused();
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const loadFeelings = async () => {
    if (!db) {
      console.log("DB 객체가 없습니다!");
      return;
    }
    try {
      const allRows = await db.getAllAsync<Feeling>(
        "SELECT * FROM feelings ORDER BY id DESC"
      );
      setFeelings(allRows);
      console.log("불러온 일기 목록:", allRows);
    } catch (error) {
      console.log("데이터 조회 오류:", error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      loadFeelings();
    }
  }, [isFocused, db]);
  const onDelete = async (id: number) => {
    if (!db) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setFeelings((prev) => prev.filter((feeling) => feeling.id !== id));
    try {
      await db.runAsync(`DELETE FROM feelings WHERE id = ?`, id);
      loadFeelings();
    } catch (error) {
      console.log("데이터 삭제 오류:", error);
      loadFeelings();
    }
  };

  return (
    <Container>
      <Title>오늘의 일기</Title>
      <ListContainer>
        <FlatList
          data={feelings}
          contentContainerStyle={{
            paddingVertical: 10,
          }}
          ItemSeparatorComponent={Separator}
          keyExtractor={(feeling) => String(feeling.id)}
          renderItem={({ item }) => (
            <RecordContainer>
              <Record>
                <Emotion>{item.emotion}</Emotion>
                <Message>{item.message}</Message>
              </Record>
              <Btns>
                <TouchableOpacity
                  onPress={() => {
                    onDelete(item.id);
                  }}
                >
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigate("Write", {
                      id: item.id,
                      emotion: item.emotion,
                      message: item.message,
                    });
                  }}
                >
                  <MaterialIcons name="edit" size={22} color="black" />
                </TouchableOpacity>
              </Btns>
            </RecordContainer>
          )}
        />
      </ListContainer>
      <BannerContainer>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </BannerContainer>
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" size={40} color="white" />
      </Btn>
    </Container>
  );
};
export default Home;
