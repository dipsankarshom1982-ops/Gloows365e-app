// app/contest/quiz.tsx

import { submitContest } from "@/services/submitContest";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ContestQuizScreen = ({ route, navigation }: any) => {
  const { contest } = route.params;
  const [selected, setSelected] = useState("");
  const question = contest.questions[0];

  const handleSubmit = async () => {
    const isCorrect = selected === question.answer;
    const score = isCorrect ? 10 : 0;

    await submitContest(contest.id, score);

    navigation.navigate("result", {
      score,
      contestId: contest.id,
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{question.question}</Text>

      {question.options.map((opt: string) => (
        <TouchableOpacity key={opt} onPress={() => setSelected(opt)}>
          <Text style={{ margin: 10 }}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleSubmit}>
        <Text style={{ color: "green" }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContestQuizScreen;