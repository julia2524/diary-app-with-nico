import styled from "styled-components/native";
import colors from "../colors";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { DBContext, useDB } from "../context";
import { useNavigation } from "@react-navigation/native";
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
const emotions = ["🤯", "🥲", "🤬", "🤗", "🥰", "😊", "🤩"];
const Write = () => {
  const db = useDB();
  const navigation = useNavigation();
  // useEffect(() => {
  //   console.log(db);
  // }, []);
  const [selectedEmotion, setEmotion] = useState<null | string>(null);
  const [feelings, setFeelings] = useState("");
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
      // console.log("저장 성공 결과:", result);
      navigation.goBack();
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
    </Container>
  );
};
export default Write;
