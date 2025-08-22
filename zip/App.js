import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import herbalData from "./conditions.json";
import logo from "./assets/mort.png";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const systems = herbalData.document.systems;

function HomeScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const insets = useSafeAreaInsets();

  const diseaseData = systems
    .flatMap(
      (system) =>
        system.diseases?.map((disease) => ({
          ...disease,
          systemName: system.name,
          image: disease.herbs?.[0]?.image || "https://via.placeholder.com/150",
        })) || []
    )
    .filter(Boolean);

  const filteredDiseases = diseaseData.filter((disease) => {
    return (
      disease.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.symptoms_and_signs
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleBackToWelcome = () => {
    setShowSearchResults(false);
    setSearchQuery("");
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator style={{ width: 200 }} color="white" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar backgroundColor="#2e7d32" barStyle="light-content" />
      <Image
        source={require("./assets/background.jpg")}
        style={styles.backgroundImage}
        blurRadius={showSearchResults ? 3 : 0}
      />

      {/* Green header that stretches to top */}
      <View style={styles.headerContainer}>
        <SafeAreaView style={styles.safeAreaHeader}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.welcomeTitleWhite}>Welcome to HerbAfric!</Text>
        </SafeAreaView>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInputWhite}
            placeholder="Search diseases or symptoms..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
          />
        </View>

        {showSearchResults ? (
          <>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToWelcome}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="green"
              />
              <Text style={styles.backButtonTextWhite}>Back to welcome</Text>
            </TouchableOpacity>
            <FlatList
              style={{ flex: 1 }}
              data={searchQuery ? filteredDiseases : diseaseData}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              contentContainerStyle={styles.gridContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.diseaseCardGreen}
                  onPress={() =>
                    navigation.navigate("DiseaseDetail", { disease: item })
                  }
                >
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7",
                    }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitleWhite} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.cardSystemWhite}>
                      {item.systemName}
                    </Text>
                    <Text style={styles.cardSymptomsWhite} numberOfLines={2}>
                      {item.symptoms_and_signs}
                    </Text>
                    <Text style={styles.herbsCountWhite}>
                      {item.herbs?.length ?? 0}{" "}
                      {item.herbs?.length === 1 ? "remedy" : "remedies"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTextWhite}>
                    No diseases found matching your search
                  </Text>
                </View>
              }
            />
          </>
        ) : (
          <ScrollView contentContainerStyle={styles.welcomeContainerWhite}>
            <View style={styles.welcomeCardGreen}>
              {!showSearchResults && (
                <TouchableOpacity
                  style={styles.bestPracticesButton}
                  onPress={() => navigation.navigate("BestPractices")}
                >
                  <MaterialCommunityIcons
                    name="lightbulb-on"
                    size={24}
                    color="white"
                  />
                  <Text style={styles.bestPracticesButtonText}>
                    Read Best Practices Guide
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.instructionSection}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={24}
                  color="green"
                />
                <Text style={styles.instructionTextWhite}>
                  Tap the search bar above to explore diseases and their herbal
                  treatments...
                </Text>
              </View>

              <View style={styles.instructionSection}>
                <MaterialCommunityIcons
                  name="information"
                  size={24}
                  color="green"
                />
                <Text style={styles.instructionTextWhite}>
                  Browse remedies by disease or search for specific symptoms
                </Text>
              </View>

              <View style={styles.instructionSection}>
                <MaterialCommunityIcons name="leaf" size={24} color="green" />
                <Text style={styles.instructionTextWhite}>
                  Discover traditional preparations and native names for each
                  herb
                </Text>
              </View>
              <View style={styles.instructionSection}>
                <MaterialCommunityIcons name="leaf" size={24} color="green" />
                <Text style={styles.instructionTextWhite}>
                  Information about the diseases and herbal remedies are sourced
                  from the 
                  <Text
                    style={{ color: "blue" }}
                    onPress={() =>
                      Linking.openURL("https://dibanduherbals.com/")
                    }
                  >
                   ; Dibandu herbals
                    website.
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.oops}>
              <MaterialCommunityIcons
                name="information"
                size={39}
                color="red"
              />
              <Text style={styles.oopsText}>
                Always consult a qualified healthcare provider before using
                herbal remedies, especially if pregnant, nursing, taking
                medications, or managing a health condition.
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
function DiseaseDetailScreen({ route, navigation }) {
  const disease = route.params?.disease || {};
  const insets = useSafeAreaInsets();

  if (!route.params?.disease) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: "#2e7d32" }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.textWhite}>
            Disease information not available
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLinkWhite}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: "rgba(45, 145, 32, 0.9)" }]}
    >
      <ScrollView
        style={styles.detailContainer}
        contentContainerStyle={{ paddingTop: 1 }}
      >
        <View style={[styles.detailHeader, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.detailTitleWhite}>{disease.name}</Text>
        </View>

        {disease.symptoms_and_signs && (
          <Text style={styles.detailSubtitleWhite}>
            Symptoms: {disease.symptoms_and_signs}
          </Text>
        )}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleWhite}>Herbal Remedies</Text>
          {disease.herbs?.map((herb, index) => (
            <View key={index} style={styles.herbCardGreen}>
              <Text style={styles.herbNameWhite}>{herb.name}</Text>

              {herb.native_names && (
                <View style={styles.nativeNamesContainer}>
                  <Text style={styles.nativeNamesTitleWhite}>
                    Native Names:
                  </Text>
                  {Object.entries(herb.native_names).map(([language, name]) => (
                    <Text key={language} style={styles.nativeNameWhite}>
                      {language}: {name}
                    </Text>
                  ))}
                </View>
              )}

              {herb.preparation && (
                <>
                  <Text style={styles.preparationTitleWhite}>Preparation:</Text>
                  <Text style={styles.preparationTextWhite}>
                    {herb.preparation}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#2e7d32" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BestPractices" component={BestPracticesScreen} />
        <Stack.Screen
          name="DiseaseDetail"
          component={DiseaseDetailScreen}
          options={{
            gestureEnabled: true,
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current, next, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
                overlayStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                  }),
                },
              };
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function BestPracticesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: "rgba(45, 145, 32, 0.9)" }]}
    >
      <ScrollView
        style={styles.detailContainer}
        contentContainerStyle={{ paddingTop: 1 }}
      >
        <View style={[styles.detailHeader, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.detailTitleWhite}>Best Practices</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.info}>
            Herbs have been an integral part of Nigerian culture for centuries,
            serving medicinal, culinary, and spiritual purposes. From neem
            (Dogoyaro) to bitter leaf (Vernonia amygdalina) and moringa, herbs
            play a vital role in traditional medicine and daily nutrition.
            However, improper use can lead to inefficacy or harm.
            <View width={`100%`}>
              <Text style={styles.pomp}>Sourcing</Text>
            </View>
            In Nigeria, herbs can be sourced from local markets, forests, or
            home gardens. It is crucial to obtain herbs from trusted suppliers
            to avoid contamination or misidentification. For example, Utazi
            (Gongronema latifolium) and Uziza (Piper guineense) are commonly
            sold in markets, but buyers must ensure they are free from
            pesticides. Herbs can be obtained from local markets, such as
            Oyingbo Market in Lagos, Watt Market in Calabar, Ose market in
            Onitsha, where vendors sell fresh and dried herbs like lemongrass
            and hibiscus (zobo). To ensure quality:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Purchase from trusted sellers who maintain hygiene and avoid
                contamination.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Misidentification can be common; for example, mistaking
                Euphorbia hirta (used for asthma) for a toxic look-alike can be
                dangerous. Consult herbalists or use identification guides.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Opt for herbs grown without synthetic pesticides, as chemical
                residues can affect health. Organizations like the Organic
                Agriculture Project in Nigeria promote pesticide-free herb
                farming.{" "}
              </Text>
            </View>
            Wild-sourced herbs should be harvested sustainably to prevent
            depletion, especially endangered species like African cherry (Prunus
            africana).
            <View width={`100%`}>
              <Text style={styles.pomp}>Cultivation</Text>
            </View>
            Growing herbs at home ensures quality and reduces reliance on wild
            harvesting. Popular Nigerian herbs like scent leaf (Ocimum
            gratissimum), moringa, and lemongrass thrive in tropical climates.
            Growing herbs in Nigeria’s diverse climates, from the humid south to
            the semi-arid north, is feasible with proper techniques:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Select herbs suited to local conditions. For instance, moringa
                thrives in northern Nigeria’s dry climate, while scent leaf
                grows well in the humid south.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Use compost or manure instead of chemical fertilizers.
                Small-scale farmers use cow dung or chicken droppings to enrich
                soil for basil cultivation.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Urban residents in cities like Abuja can grow herbs like thyme
                or mint in pots or small backyard plots, ensuring fresh supply
                and reducing reliance on markets.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • In water-scarce regions like Kano, drip irrigation helps
                cultivate herbs like rosemary efficiently.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Practice crop rotation to prevent soil degradation.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>Harvesting</Text>
            </View>
            Proper harvesting maximizes herb potency and plant health:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Timing: Harvest herbs like bitter leaf and basil in the
                morning when essential oils are concentrated. For example, Igbo
                farmers harvest uziza leaves early to retain flavor. Roots (like
                ginger or turmeric) should be dug up at maturity.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Technique: Use clean, sharp tools to avoid damaging plants and
                contamination. For root herbs like ginger, dig carefully to
                preserve the plant for regrowth. For bitter leaf, plucking young
                leaves promotes regrowth.{" "}
              </Text>
            </View>
            • Sustainable Harvesting: Avoid overharvesting wild herbs like
            Gongronema latifolium (utazi), which is at risk in South-Eastern
            Nigeria due to excessive wild collection. Avoid uprooting entire
            plants; take only what is needed to allow regeneration.
            <View width={`100%`}>
              <Text style={styles.pomp}>Storage</Text>
            </View>
            Proper storage preserves herb quality. : Improper storage leads to
            mold or loss of potency. Best practices include:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Fresh Herbs: Store fresh scent leaf or mint in perforated
                plastic bags in a refrigerator for up to two weeks. In rural
                areas without refrigeration, wrap herbs in damp cloth and keep
                in a cool, shaded place. Fresh herbs like Ugu (fluted pumpkin)
                can be frozen for extended use.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Drying: Spread leaves like scent leaf or moringa in a shaded,
                well-ventilated area. Dried Herbs: Dry herbs like hibiscus in a
                well-ventilated area away from direct sunlight to prevent
                nutrient loss. Store in airtight containers to avoid mold,
                common in Nigeria’s humid regions.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Labeling: Clearly label containers with herb names and dates,
                as misidentification of dried herbs like moringa and neem can
                lead to misuse.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>Fresh vs. Dried Herbs </Text>
            </View>
            Both fresh and dried herbs have unique applications in Nigeria:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Fresh Herbs: Preferred for culinary uses, like adding scent
                leaf to egusi soup for its aromatic flavor. Fresh herbs retain
                more volatile oils but spoil quickly.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Dried Herbs: Ideal for medicinal teas, such as dried hibiscus
                for zobo drinks, which are popular in northern Nigeria. Dried
                herbs (e.g., cloves or ginger powder) have a longer shelf life
                but may lose some potency.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Best Practice: Use fresh herbs for immediate consumption and
                dried herbs for long-term storage or when fresh options are
                unavailable, especially during dry seasons in northern Nigeria.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>Preparation </Text>
            </View>
            Proper preparation ensures herbs deliver their intended benefits:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Cleaning: Wash fresh herbs like bitter leaf thoroughly to
                remove dirt or pesticide residues, a common concern in herbs
                from non-organic farms.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Method of Use: For medicinal purposes, prepare infusions
                (e.g., moringa tea for malnutrition) or decoctions (e.g., neem
                bark for malaria). For culinary use, chop uziza finely to
                release flavors in soups.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Dosage: Follow traditional or expert guidance on quantities.
                For example, excessive consumption of bitter leaf juice can
                cause digestive upset.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>
                Potential Side Effects and Interactions
              </Text>
            </View>
            Herbs can have side effects or interact with medications:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Side Effects: Overuse of bitter leaf may lead to nausea or
                diarrhea. Neem, used for skin conditions, can cause liver
                toxicity in high doses.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Drug Interactions: Moringa may enhance the effects of
                antidiabetic drugs, posing risks for hypoglycemic patients.
                Bitter kola (Garcinia kola) can interact with blood pressure
                medications Consult healthcare providers, especially in urban
                centers like Lagos, Enugu, Kano where herbal and conventional
                medicine use overlaps.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Testing: Start with small doses to monitor reactions,
                particularly with potent herbs like Ageratum conyzoides (goat
                weed) used in traditional Yoruba remedies.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>Special Populations</Text>
            </View>
            Certain groups require extra caution:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Pregnant Women: Avoid herbs like dongoyaro (neem), pawpaw
                leaves, which may induce miscarriage. In contrast, ginger is
                safe in moderation for nausea.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Children: Use mild herbs like lemongrass in small doses for
                children. High doses of bitter leaf can cause stomach upset in
                young children.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Elderly: Elderly individuals with chronic conditions, common
                in Nigeria’s aging population, should avoid herbs like ginseng
                that may affect blood pressure. Individuals should monitor
                herb-drug interactions, especially with diabetes or hypertension
                medications.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>Sustainable and Ethical</Text>
            </View>
            Herb Use Overharvesting and unsustainable herb use can harm
            Nigeria’s ecosystems:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Deforestation: Overharvesting wild herbs like utazi
                contributes to biodiversity loss in the Niger Delta. Wild herbs
                like African walnut (Tetracarpidium conophorum) are also
                threatened. Promote cultivation over wild harvesting.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Soil Health: Rotate herb crops to prevent soil depletion. In
                Anambra, farmers rotate basil with legumes to maintain soil
                fertility.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Water Conservation: Use rainwater harvesting for herb gardens,
                as practiced in parts of Nigeria, to reduce environmental
                strain.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>Ethical Consideration</Text>
            </View>
            Ethical herb use respects cultural and ecological values:
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Cultural Respect: Acknowledge traditional knowledge, such as
                Yoruba herbal practices, and involve local herbalists in
                sourcing decisions.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Fair Trade: Support local farmers by purchasing from
                cooperatives like the Herb Growers Association in Enugu,
                ensuring fair compensation.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Biodiversity: Avoid cultivating invasive herbs that could
                disrupt local ecosystems, such as unchecked growth of mint in
                wetland areas.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.bullet}>
                • Avoiding biopiracy: Foreign exploitation of Nigerian herbs
                without benefit-sharing.{" "}
              </Text>
            </View>
            <View width={`100%`}>
              <Text style={styles.pomp}>Conclusion</Text>
            </View>
            Herbs are invaluable in Nigeria for health, nutrition, and culture.
            Utilizing herbs requires careful attention to sourcing, cultivation,
            harvesting, storage, and preparation to maximize benefits while
            minimizing risks. By prioritizing sustainable practices, respecting
            cultural heritage, and addressing environmental and ethical
            concerns, Africa can continue to harness the power of herbs like
            moringa, scent leaf, and uziza. Integrating traditional knowledge
            with modern safety practices ensures herbs remain a valuable
            resource for health, cuisine, and culture. Ethical use and
            environmental conservation will preserve these resources for future
            generations.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#2e7d32",
    width: "100%",
  },
  safeAreaHeader: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  searchContainer: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    opacity: 0.9,
  },
  header: {
    backgroundColor: "#2e7d32",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
  },
  logoImage: {
    width: 120, // adjust as needed
    height: 40, // adjust as needed
    alignSelf: "center",
    marginTop: 20,
  },
  searchContainer: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 20,
  },
  searchInputWhite: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    padding: 19,
    borderRadius: 16,
    fontSize: 17,
    margin: 10,
    marginBottom: 15,
    color: "white",
  },
  diseaseCardGreen: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(45, 145, 32, 0.7)",
    borderRadius: 10,
    padding: 5,
    margin: CARD_MARGIN / 2,
    height: 220,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  cardTitleWhite: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  cardSystemWhite: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
    fontStyle: "italic",
  },
  cardSymptomsWhite: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  herbsCountWhite: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
    alignSelf: "flex-end",
  },
  welcomeContainerWhite: {
    flexGrow: 1,
    padding: 8,
  },
  welcomeCardGreen: {
    backgroundColor: "none",
    opacity: 2,
    borderRadius: 12,
    padding: 20,
    paddingTop: 0,
    marginTop: 30,
    marginBottom: 20,
  },
  welcomeTitleWhite: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 15,
    textAlign: "center",
  },
  welcomeTextWhite: {
    fontSize: 16,
    color: "green",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  instructionSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  instructionTextWhite: {
    fontSize: 15,
    color: "green",
    marginLeft: 10,
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 15,
  },
  backButtonTextWhite: {
    color: "green",
    marginLeft: 5,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTextWhite: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e7d32",
  },
  textWhite: {
    color: "white",
  },
  backLinkWhite: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  detailContainer: {
    flex: 1,
    backgroundColor: "rgba(45, 145, 32, 0.9)",
  },
  detailHeader: {
    backgroundColor: "rgba(45, 145, 32, 0.9)",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
  },
  detailTitleWhite: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    marginRight: 30,
    textAlign: `center`,
  },
  detailSubtitleWhite: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    margin: 15,
    marginTop: 10,
  },
  sectionContainer: {
    padding: 15,
  },
  sectionTitleWhite: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  herbCardGreen: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
  },
  herbNameWhite: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  nativeNamesContainer: {
    marginBottom: 10,
  },
  nativeNamesTitleWhite: {
    fontWeight: "bold",
    color: "white",
  },
  nativeNameWhite: {
    marginLeft: 10,
    color: "rgba(255, 255, 255, 0.9)",
  },
  preparationTitleWhite: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  preparationTextWhite: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  gridContainer: {
    paddingBottom: 20,
    paddingTop: 25,
    flexGrow: 1,
  },
  oops: {
    position: "absolute",
    bottom: 50,
    left: 12,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
  },
  oopsText: {
    fontSize: 15,
    color: "green",
    flex: 1,
    marginTop: 10,
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  bestPracticesButton: {
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: `#000`,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.71,
    shadowRadius: 3.84,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    justifyContent: "center",
  },
  bestPracticesButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  bestPracticeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  bestPracticeText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  info: {
    color: "white",
    fontSize: 17,
    marginTop: 20,
    marginLeft: 9,
    width: `95%`,
  },
  pomp: {
    color: "white",
    fontSize: 23,
    fontWeight: `bold`,
    marginTop: 30,
    marginBottom: 5,
    textAlign: `left`,
    justifyContent: `left`,
  },
  bullet: {
    color: "white",
    marginLeft: 7,
    fontSize: 17,
    marginTop: 9,
    marginBottom: 9,
  },
});

export default App;
