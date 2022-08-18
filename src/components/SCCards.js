import { Button, Card, Headline, Paragraph, Subheading, Title } from "react-native-paper";
import { Styles } from "../styles/styles";

const CreateSCCards = ({ image, title, id, subttitle, data, cardImageClick, cardClick, buttonData }) => {
  return (
    <Card
      style={[Styles.marginTop16]}
      onPress={() => {
        cardClick && cardClick(title, id, data);
        cardImageClick && cardImageClick(image, data);
      }}
    >
      <Card.Cover source={{ uri: image }} />
      <Card.Content>
        <Title style={[Styles.paddingTop12]}>{title}</Title>
        <Subheading style={[Styles.paddingBottom12]}>({subttitle})</Subheading>
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
