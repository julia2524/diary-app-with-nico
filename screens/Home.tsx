import styled from "styled-components/native";
import colors from "../colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Container = styled.View`
  flex: 1;
  padding: 100px 30px 0 30px;
  background-color: ${colors.bgColor};
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  margin-bottom: 100px;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
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

const Home = ({ navigation: { navigate } }) => (
  <Container>
    <Title>My journal</Title>
    <Btn onPress={() => navigate("Write")}>
      <Ionicons name="add" size={40} color="white" />
    </Btn>
  </Container>
);
export default Home;
