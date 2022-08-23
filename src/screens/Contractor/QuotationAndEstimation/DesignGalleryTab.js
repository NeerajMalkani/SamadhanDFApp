import { ScrollView, View } from "react-native";
import NoItems from "../../../components/NoItems";
import CreateSCCards from "../../../components/SCCards";
import { Styles } from "../../../styles/styles";

const DesignGalleryTab = ({ navigation, designGalleryData }) => {
  const SingleCardClick = (headerTitle, categoryID, data) => {
    navigation.navigate("ImageGalleryWorkLocationScreen", { headerTitle: headerTitle, categoryID: categoryID, data: data });
  };

  return (
    <View>
      {designGalleryData.length > 0 ? (
        <ScrollView style={[Styles.flex1, Styles.flexColumn]}>
          <View style={[Styles.padding16, Styles.paddingTop0]}>
            {designGalleryData.map((k, i) => {
              return <CreateSCCards key={i} image={k.designImage} title={k.serviceName} id={k.serviceID} subttitle={k.designTypeName} data={k} cardClick={SingleCardClick} />;
            })}
          </View>
        </ScrollView>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}
    </View>
  );
};

export default DesignGalleryTab;
