import * as Linking from "expo-linking";
import { router } from "expo-router";
import { Story } from "../lib/story";
import { User } from "../lib/user";
import { trackActivity } from "./activityService";
import { giveCoins } from "./rewardService";

export const handleStoryAction = async (
  story: Story,
  user: User
) => {
  await trackActivity(user.id, story.id, "click");

  if (story.reward.type === "click") {
    await giveCoins(user.id, story.reward.coins);
  }

  if (story.cta.actionType === "external") {
    Linking.openURL(story.cta.link);
  } else {
    router.push(story.cta.link as any);
  }
};