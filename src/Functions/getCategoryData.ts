import Category from "../classes/Category";
import { EasyTriviaError } from "../classes/CustomErrors";
import EasyTriviaUtil from "../classes/EasyTriviaUtil";
import { CategoryData, OpenTDBResponseCategoryData } from "../Typings/interfaces";
import { CategoryName, CategoryResolvable } from "../Typings/types";

export default async function getCategoryData(arg:CategoryResolvable) {
  const categoryId = Category.resolve(arg)?.id;
  if (!categoryId) {
    throw new EasyTriviaError(
      `Given argument does not resolve into a trivia category`,
      EasyTriviaError.errors.headers.INVALID_ARG
    );
  }

  const baseLink = EasyTriviaUtil.links.base.CATEGORY_DATA;
  const data = await EasyTriviaUtil.openTDBRequest(baseLink + categoryId) as OpenTDBResponseCategoryData;
  const {
    category_id: id,
    category_question_count: {
      total_question_count: total,
      total_easy_question_count: forEasy,
      total_medium_question_count: forMedium,
      total_hard_question_count: forHard,
    },
  } = data;

  const result:CategoryData = {
    id,
    name: Category.idToPrettyName(id) as CategoryName<'Pretty'>,
    questionCounts: {
      total,
      forEasy,
      forMedium,
      forHard,
    },
  };

  return result;
}