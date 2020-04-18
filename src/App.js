import React, { useEffect, useState } from "react";

import {
  Image,
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import likeBtn from "./assets/image/like.png";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("repositories")
      .then((response) => {
        setRepositories(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleLikeRepository(id, index) {
    api.post(`repositories/${id}/like`).then((response) => {
      let updatedRepositories = [...repositories];
      // const updatedIndex = updatedRepositories.findIndex(repo =>{ repo.id === id})
      updatedRepositories[index] = response.data;
      setRepositories(updatedRepositories);
    });
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.centerText}> Carregando repositórios</Text>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : repositories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.centerText}>
              Não exitem repositórios disponíveis
            </Text>
            <Text style={styles.centerText}>😥</Text>
          </View>
        ) : (
          <FlatList
            extraData={repositories}
            data={repositories}
            keyExtractor={(repositories) => repositories.id}
            renderItem={({ item: repo, index }) => (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{repo.title}</Text>

                <View style={styles.techsContainer}>
                  {repo.techs.map((technology, index) => (
                    <Text key={index} style={styles.tech}>
                      {technology}
                    </Text>
                  ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repo.id}`}
                  >
                    {repo.likes} curtidas
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleLikeRepository(repo.id, index)}
                    testID={`like-button-${repo.id}`}
                  >
                    <Image source={likeBtn} style={styles.likeIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  likeIcon: {
    width: 40,
    height: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    fontSize: 32,
  },
});
