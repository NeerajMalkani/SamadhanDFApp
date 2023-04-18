import { Button, Card, Subheading, Title } from "react-native-paper";
import { Styles } from "../styles/styles";

const CreateSCCards = ({ image, title, id, subttitle, data, cardImageClick, cardClick, buttonData }) => {
  return (
    <Card
      style={[Styles.marginTop16, Styles.borderRadius8, Styles.OverFlow, Styles.padding0]}
      onPress={() => {
        cardClick && cardClick(title, id, data);
        cardImageClick && cardImageClick(image, data);
      }}
    >
      <Card style={[Styles.positionRelative]} evalution={10}>
        <Card.Cover source={{ uri: image }} style={[Styles.height250]} />
        <Card.Content style={[Styles.positionAbsolute, { backgroundColor: "rgba(15, 15, 15,0.7)", bottom: buttonData ? 52 : 0 }, Styles.width100per, Styles.height80]}>
          <Title numberOfLines={1} style={[Styles.paddingTop12, Styles.fontSize14, Styles.textColorWhite]}>
            {title}
          </Title>
          {subttitle != null &&
            <>
              <Subheading style={[Styles.paddingBottom12, Styles.fontSize12, Styles.textColorWhite]}>({subttitle})</Subheading>
            </>
          }

        </Card.Content>
        {buttonData && (
          <Card.Actions>
            <Button disabled={buttonData.disabled ? buttonData.disabled : false} onPress={buttonData.click}>
              {buttonData.text}
            </Button>
          </Card.Actions>
        )}
      </Card>
    </Card>
  );
};

export default CreateSCCards;
