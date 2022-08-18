import { Button, Card, Headline, Paragraph, Title } from "react-native-paper";
import { Styles } from "../styles/styles";

const CreateSCCards = ({ image, title, id, subttitle, cardImageClick, cardClick, buttonData }) => {
  console.log(image);
  return (
    <Card
      style={[Styles.marginTop16]}
      onPress={() => {
        cardClick && cardClick(title, id);
        cardImageClick && cardImageClick(image);
      }}
    >
      <Card.Cover source={{ uri: image }} />
      <Card.Content>
        <Headline style={[Styles.paddingTop12]}>{title}</Headline>
        <Paragraph style={[Styles.paddingBottom12]}>({subttitle})</Paragraph>
      </Card.Content>
      {buttonData && (
        <Card.Actions>
          <Button onPress={buttonData.click}>{buttonData.text}</Button>
        </Card.Actions>
      )}
    </Card>
  );
};

export default CreateSCCards;
