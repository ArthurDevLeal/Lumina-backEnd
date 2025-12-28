// src/index.ts
import cors from "cors";
import express, { urlencoded } from "express";
import helmet from "helmet";

// src/routes/main-router.ts
import { Router } from "express";

// src/controllers/auth-controller.ts
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

// view-model/user-view-model.ts
var userViewModel = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance,
    saving: user.saving,
    avatarUrl: user.avatarUrl
  };
};

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.1.0",
  "engineVersion": "ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id             String           @id @default(cuid())\n  createdAt      DateTime         @default(now())\n  updatedAt      DateTime         @updatedAt\n  name           String?\n  email          String           @unique\n  password       String\n  avatarUrl      String?\n  balance        Int              @default(0)\n  saving         Int              @default(0)\n  outcomeHistory OutcomeHistory[]\n  incomeHistory  IncomeHistory[]\n  goals          Goal[]\n  categories     Category[]\n  outcomes       Outcome[]\n  incomes        Income[]\n}\n\nmodel OutcomeHistory {\n  id              String    @id @default(cuid())\n  userId          String\n  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  totalOutcome    Int       @default(0)\n  fixedOutcome    Int       @default(0)\n  variableOutcome Int       @default(0)\n  listOfOutcomes  Outcome[]\n  createdAt       DateTime  @default(now())\n  updatedAt       DateTime  @updatedAt\n}\n\nmodel Outcome {\n  id               String            @id @default(cuid())\n  outcomeHistoryId String\n  outcomeHistory   OutcomeHistory    @relation(fields: [outcomeHistoryId], references: [id], onDelete: Cascade)\n  userId           String\n  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt        DateTime          @default(now())\n  value            Int               @default(0)\n  brand            String?\n  name             String\n  type             OutcomeIncomeType\n  categoryId       String\n  category         Category          @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n}\n\nmodel IncomeHistory {\n  id             String   @id @default(cuid())\n  userId         String\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  totalIncome    Int      @default(0)\n  fixedIncome    Int      @default(0)\n  variableIncome Int      @default(0)\n  listOfIncomes  Income[]\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n}\n\nmodel Income {\n  id              String            @id @default(cuid())\n  incomeHistoryId String\n  incomeHistory   IncomeHistory     @relation(fields: [incomeHistoryId], references: [id], onDelete: Cascade)\n  userId          String\n  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt       DateTime          @default(now())\n  value           Int               @default(0)\n  brand           String?\n  name            String\n  type            OutcomeIncomeType\n  category        String\n}\n\nmodel Goal {\n  id           String         @id @default(cuid())\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  name         String\n  type         String\n  targetValue  Float          @default(0)\n  currentValue Float          @default(0)\n  finalDate    DateTime?\n  status       String\n  userId       String\n  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n  goalProgress GoalProgress[]\n}\n\nmodel GoalProgress {\n  id        String   @id @default(cuid())\n  createdAt DateTime @default(now())\n  goalId    String\n  goal      Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)\n  amount    Int      @default(0)\n}\n\nmodel Category {\n  id         String    @id @default(cuid())\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n  userId     String\n  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  name       String\n  moneySpent Int       @default(0)\n  outcomes   Outcome[]\n}\n\nenum OutcomeIncomeType {\n  Fixed\n  Variable\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"balance","kind":"scalar","type":"Int"},{"name":"saving","kind":"scalar","type":"Int"},{"name":"outcomeHistory","kind":"object","type":"OutcomeHistory","relationName":"OutcomeHistoryToUser"},{"name":"incomeHistory","kind":"object","type":"IncomeHistory","relationName":"IncomeHistoryToUser"},{"name":"goals","kind":"object","type":"Goal","relationName":"GoalToUser"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"outcomes","kind":"object","type":"Outcome","relationName":"OutcomeToUser"},{"name":"incomes","kind":"object","type":"Income","relationName":"IncomeToUser"}],"dbName":null},"OutcomeHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OutcomeHistoryToUser"},{"name":"totalOutcome","kind":"scalar","type":"Int"},{"name":"fixedOutcome","kind":"scalar","type":"Int"},{"name":"variableOutcome","kind":"scalar","type":"Int"},{"name":"listOfOutcomes","kind":"object","type":"Outcome","relationName":"OutcomeToOutcomeHistory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Outcome":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"outcomeHistoryId","kind":"scalar","type":"String"},{"name":"outcomeHistory","kind":"object","type":"OutcomeHistory","relationName":"OutcomeToOutcomeHistory"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OutcomeToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"value","kind":"scalar","type":"Int"},{"name":"brand","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"OutcomeIncomeType"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToOutcome"}],"dbName":null},"IncomeHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"IncomeHistoryToUser"},{"name":"totalIncome","kind":"scalar","type":"Int"},{"name":"fixedIncome","kind":"scalar","type":"Int"},{"name":"variableIncome","kind":"scalar","type":"Int"},{"name":"listOfIncomes","kind":"object","type":"Income","relationName":"IncomeToIncomeHistory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Income":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"incomeHistoryId","kind":"scalar","type":"String"},{"name":"incomeHistory","kind":"object","type":"IncomeHistory","relationName":"IncomeToIncomeHistory"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"IncomeToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"value","kind":"scalar","type":"Int"},{"name":"brand","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"OutcomeIncomeType"},{"name":"category","kind":"scalar","type":"String"}],"dbName":null},"Goal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"name","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"targetValue","kind":"scalar","type":"Float"},{"name":"currentValue","kind":"scalar","type":"Float"},{"name":"finalDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"GoalToUser"},{"name":"goalProgress","kind":"object","type":"GoalProgress","relationName":"GoalToGoalProgress"}],"dbName":null},"GoalProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"goalId","kind":"scalar","type":"String"},{"name":"goal","kind":"object","type":"Goal","relationName":"GoalToGoalProgress"},{"name":"amount","kind":"scalar","type":"Int"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"moneySpent","kind":"scalar","type":"Int"},{"name":"outcomes","kind":"object","type":"Outcome","relationName":"CategoryToOutcome"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/service/user-service.ts
var createUser = async (data) => {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password
    }
  });
  if (user) return { success: true, data: user };
  return console.error("Error Creating new user");
};
var findUser = async ({ email, id }) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { id }] }
  });
  if (user) return { success: true, data: user };
  return console.error("Error finding the user");
};
var updateUser = async ({ id, data }) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      avatarUrl: data.avatarUrl
    }
  });
  if (user) return { success: true, data: user };
  return console.error("Error updating the user");
};
var deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: { id }
  });
  if (user) return { success: true, data: user };
  return console.error("Error deleting the user");
};
var adjustBalance = async ({ id, amount }) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        balance: {
          increment: amount
        }
      }
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error adjusting user balance:", error);
    return { success: false, data: null };
  }
};
var adjustSaving = async ({ id, amount }) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        saving: {
          increment: amount
        }
      }
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error adjusting user saving:", error);
    return { success: false, data: null };
  }
};
var setBalance = async ({ id, amount }) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        balance: amount
      }
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error setting user balance:", error);
    return { success: false, data: null };
  }
};
var setSaving = async ({ id, amount }) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        saving: amount
      }
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error setting user saving:", error);
    return { success: false, data: null };
  }
};

// src/controllers/auth-controller.ts
var authController = class {
  async authenticate(req, res) {
    const { email, password } = req.body;
    const userReq = await findUser({ email });
    if (!userReq || !userReq.success) return res.status(400).json({ error: "Error finding User" });
    const isValuePassword = await compare(password, userReq.data.password);
    if (!isValuePassword) return res.status(401).json({ error: "Password invalid" });
    const token = jwt.sign({ id: userReq.data.id }, process.env.SECRETKEY, { expiresIn: "1d" });
    return res.json({ user: userViewModel(userReq.data), token });
  }
};

// src/service/category-service.ts
var createCategory = async ({ data }) => {
  const category = await prisma.category.create({ data });
  if (category) return { success: true, data: category };
  return console.error("Error Creating new category");
};
var getCategoryById = async ({ id }) => {
  const category = await prisma.category.findFirst({ where: { id } });
  if (category) return { success: true, data: category };
  return console.error("Error finding the category");
};
var getCategoriesByUser = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const category = await prisma.category.findMany({ where: { userId } });
  if (category) return { success: true, data: category };
  return console.error("Error finding all the categories");
};
var updateCategory = async ({ id, data }) => {
  const category = await prisma.category.update({ where: { id }, data });
  if (category) return { success: true, data: category };
  return console.error("Error updating category");
};
var deleteCategory = async ({ id }) => {
  const category = await prisma.category.delete({ where: { id } });
  if (category) return { success: true, data: category };
  return console.error("Error deleting category");
};
var sumMoneySpent = async ({ categoryId }) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId },
    include: {
      outcomes: true
    }
  });
  if (!category) return console.error("Category not found");
  const outcomesTotal = category.outcomes.reduce((acc, outcome) => acc + outcome.value, 0);
  const totalSpent = outcomesTotal;
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { moneySpent: totalSpent }
  });
  if (updatedCategory) return { success: true, data: { totalSpent, category: updatedCategory } };
  return console.error("Error updating money spent");
};
var getCategoryStats = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const categories = await prisma.category.findMany({
    where: { userId },
    include: {
      outcomes: true
    }
  });
  const stats = categories.map((category) => {
    const outcomesTotal = category.outcomes.reduce((acc, outcome) => acc + outcome.value, 0);
    const totalSpent = outcomesTotal;
    return {
      id: category.id,
      name: category.name,
      moneySpent: category.moneySpent,
      calculatedSpent: totalSpent,
      outcomesCount: category.outcomes.length
    };
  });
  if (stats) return { success: true, data: stats };
  return console.error("Error getting category stats");
};

// src/controllers/category-controller.ts
var categoryController = class {
  async store(req, res) {
    const userId = req.userId;
    const category = req.body;
    const categoryReq = await createCategory({
      data: {
        ...category,
        userId
      }
    });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error creating category" });
    return res.json({
      message: "Category created successfully",
      data: categoryReq.data
    });
  }
  async index(req, res) {
    const { id } = req.params;
    const categoryReq = await getCategoryById({ id });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error finding category" });
    return res.json({
      message: "Category finded successfully",
      data: categoryReq.data
    });
  }
  async indexMany(req, res) {
    const id = req.userId;
    const categoryReq = await getCategoriesByUser({ userId: id });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error finding categories" });
    return res.json({
      message: "Categories finded successfully",
      data: categoryReq.data
    });
  }
  async update(req, res) {
    const { id, data } = req.body;
    const categoryReq = await updateCategory({ id, data });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error updating category" });
    return res.json({
      message: "Category updated successfully",
      data: categoryReq.data
    });
  }
  async delete(req, res) {
    const { id } = req.body;
    const categoryReq = await deleteCategory({ id });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error deleting category" });
    return res.json({
      message: "Category deleted successfully",
      data: categoryReq.data
    });
  }
  async sumMoneySpent(req, res) {
    const { id } = req.body;
    const categoryReq = await sumMoneySpent({ categoryId: id });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error summing category" });
    return res.json({
      message: "Category sum successfully",
      data: categoryReq.data
    });
  }
  async getCategoryStats(req, res) {
    const id = req.userId;
    const categoryReq = await getCategoryStats({ userId: id });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error getting stats from category" });
    return res.json({
      message: "Category stats getted successfully",
      data: categoryReq.data
    });
  }
};

// src/service/income-history-service.ts
var createIncomeHistory = async ({ userId }) => {
  const history = await prisma.incomeHistory.create({ data: { userId } });
  if (history) return { success: true, data: history };
  return console.error("Error Creating new history");
};
var getUserincomeHistory = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const history = await prisma.incomeHistory.findFirst({ where: { userId } });
  if (history) return { success: true, data: history };
  return console.error("Error finding the history");
};
var calculateTotals = async ({ historyId }) => {
  const history = await prisma.incomeHistory.findFirst({
    where: { id: historyId },
    include: { listOfIncomes: true }
  });
  if (!history) return console.error("History not found");
  const totalincome = history.listOfIncomes.reduce((acc, income) => acc + income.value, 0);
  const fixedincome = history.listOfIncomes.filter((income) => income.type === "Fixed").reduce((acc, income) => acc + income.value, 0);
  const variableincome = history.listOfIncomes.filter((income) => income.type === "Variable").reduce((acc, income) => acc + income.value, 0);
  return { success: true, data: { totalincome, fixedincome, variableincome } };
};
var updateTotals = async ({ historyId }) => {
  const totals = await calculateTotals({ historyId });
  if (!totals) return console.error("Error calculating totals");
  const updatedHistory = await prisma.incomeHistory.update({
    where: { id: historyId },
    data: {
      totalIncome: totals.data.totalincome,
      fixedIncome: totals.data.fixedincome,
      variableIncome: totals.data.variableincome
    }
  });
  if (updatedHistory) return { success: true, data: updatedHistory };
  return console.error("Error updating totals");
};

// src/service/income-service.ts
var createIncome = async ({ data }) => {
  const Income = await prisma.income.create({ data });
  if (Income) return { success: true, data: Income };
  return console.error("Error Creating new Income");
};
var getIncomeById = async ({ id }) => {
  const Income = await prisma.income.findFirst({ where: { id } });
  if (Income) return { success: true, data: Income };
  return console.error("Error finding the Income");
};
var getAllIncomesByUser = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const Income = await prisma.income.findMany({ where: { userId } });
  if (Income) return { success: true, data: Income };
  return console.error("Error finding all the Incomes");
};
var updateIncome = async ({ id, data }) => {
  const Income = await prisma.income.update({ where: { id }, data });
  if (Income) return { success: true, data: Income };
  return console.error("Error updating Income");
};
var deleteIncome = async ({ id }) => {
  const Income = await prisma.income.delete({ where: { id } });
  if (Income) return { success: true, data: Income };
  return console.error("Error deleting Income");
};
var getIncomesByCategory = async ({ userId, categoryName }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const Incomes = await prisma.income.findMany({
    where: {
      userId,
      category: categoryName
    }
  });
  if (Incomes) return { success: true, data: Incomes };
  return console.error("Error finding Incomes by category");
};

// src/controllers/income-controller.ts
var incomeController = class {
  async store(req, res) {
    const userId = req.userId;
    const income = req.body;
    const incomeReq = await createIncome({
      data: {
        ...income,
        userId
      }
    });
    if (!incomeReq || !incomeReq.success) return res.status(400).json({ error: "Error creating income" });
    const incomeHistoryReq = await updateTotals({ historyId: income.incomeHistoryId });
    if (!incomeHistoryReq || !incomeHistoryReq.success)
      return res.status(400).json({ error: "Error updating income history" });
    return res.json({
      message: "income created successfully",
      data: incomeReq.data
    });
  }
  async index(req, res) {
    const { id } = req.params;
    const incomeReq = await getIncomeById({ id });
    if (!incomeReq || !incomeReq.success) return res.status(400).json({ error: "Error finding income" });
    return res.json({
      message: "income finded successfully",
      data: incomeReq.data
    });
  }
  async indexMany(req, res) {
    const id = req.userId;
    const incomeReq = await getAllIncomesByUser({ userId: id });
    if (!incomeReq || !incomeReq.success) return res.status(400).json({ error: "Error finding incomes" });
    return res.json({
      message: "incomes finded successfully",
      data: incomeReq.data
    });
  }
  async update(req, res) {
    const { id, data } = req.body;
    const incomeReq = await updateIncome({ id, data });
    if (!incomeReq || !incomeReq.success) return res.status(400).json({ error: "Error updating income" });
    return res.json({
      message: "income updated successfully",
      data: incomeReq.data
    });
  }
  async delete(req, res) {
    const { id } = req.body;
    const incomeReq = await deleteIncome({ id });
    if (!incomeReq || !incomeReq.success) return res.status(400).json({ error: "Error deleting income" });
    return res.json({
      message: "income deleted successfully",
      data: incomeReq.data
    });
  }
  async indexByCategory(req, res) {
    const id = req.userId;
    const { categoryName } = req.body;
    const incomeReq = await getIncomesByCategory({ userId: id, categoryName });
    if (!incomeReq || !incomeReq.success)
      return res.status(400).json({ error: "Error finding income by categories" });
    return res.json({
      message: "incomes finded by category successfully",
      data: incomeReq.data
    });
  }
};

// src/service/outcome-history-service.ts
var createOutcomeHistory = async ({ userId }) => {
  const history = await prisma.outcomeHistory.create({ data: { userId } });
  if (history) return { success: true, data: history };
  return console.error("Error Creating new history");
};
var getUserOutcomeHistory = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const history = await prisma.outcomeHistory.findFirst({ where: { userId } });
  if (history) return { success: true, data: history };
  return console.error("Error finding the history");
};
var calculateTotals2 = async ({ historyId }) => {
  const history = await prisma.outcomeHistory.findFirst({
    where: { id: historyId },
    include: { listOfOutcomes: true }
  });
  if (!history) return console.error("History not found");
  const totalOutcome = history.listOfOutcomes.reduce((acc, outcome) => acc + outcome.value, 0);
  const fixedOutcome = history.listOfOutcomes.filter((outcome) => outcome.type === "Fixed").reduce((acc, outcome) => acc + outcome.value, 0);
  const variableOutcome = history.listOfOutcomes.filter((outcome) => outcome.type === "Variable").reduce((acc, outcome) => acc + outcome.value, 0);
  return { success: true, data: { totalOutcome, fixedOutcome, variableOutcome } };
};
var updateTotals2 = async ({ historyId }) => {
  const totals = await calculateTotals2({ historyId });
  if (!totals) return console.error("Error calculating totals");
  const updatedHistory = await prisma.outcomeHistory.update({
    where: { id: historyId },
    data: {
      totalOutcome: totals.data.totalOutcome,
      fixedOutcome: totals.data.fixedOutcome,
      variableOutcome: totals.data.variableOutcome
    }
  });
  if (updatedHistory) return { success: true, data: updatedHistory };
  return console.error("Error updating totals");
};

// src/service/outcome-service.ts
var createOutcome = async ({ data }) => {
  const outcome = await prisma.outcome.create({ data });
  if (outcome) return { success: true, data: outcome };
  return console.error("Error Creating new outcome");
};
var getOutcomeById = async ({ id }) => {
  const outcome = await prisma.outcome.findFirst({ where: { id } });
  if (outcome) return { success: true, data: outcome };
  return console.error("Error finding the outcome");
};
var getAllOutcomesByUser = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const outcome = await prisma.outcome.findMany({ where: { userId } });
  if (outcome) return { success: true, data: outcome };
  return console.error("Error finding all the outcomes");
};
var updateOutcome = async ({ id, data }) => {
  const outcome = await prisma.outcome.update({ where: { id }, data });
  if (outcome) return { success: true, data: outcome };
  return console.error("Error updating outcome");
};
var deleteOutcome = async ({ id }) => {
  const outcome = await prisma.outcome.delete({ where: { id } });
  if (outcome) return { success: true, data: outcome };
  return console.error("Error deleting outcome");
};
var getOutcomesByCategory = async ({ userId, categoryId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const outcomes = await prisma.outcome.findMany({
    where: {
      userId,
      categoryId
    }
  });
  if (outcomes) return { success: true, data: outcomes };
  return console.error("Error finding outcomes by category");
};

// src/controllers/outcome-controller.ts
var outcomeController = class {
  async store(req, res) {
    const userId = req.userId;
    const outcome = req.body;
    const outcomeReq = await createOutcome({
      data: {
        ...outcome,
        userId
      }
    });
    if (!outcomeReq || !outcomeReq.success) return res.status(400).json({ error: "Error creating outcome" });
    const categoryReq = await sumMoneySpent({ categoryId: outcome.categoryId });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error summing category" });
    const outcomeHistoryReq = await updateTotals2({ historyId: outcome.outcomeHistoryId });
    if (!outcomeHistoryReq || !outcomeHistoryReq.success)
      return res.status(400).json({ error: "Error updating outcome history" });
    return res.json({
      message: "Outcome created successfully",
      data: outcomeReq.data
    });
  }
  async index(req, res) {
    const { id } = req.params;
    const outcomeReq = await getOutcomeById({ id });
    if (!outcomeReq || !outcomeReq.success) return res.status(400).json({ error: "Error finding outcome" });
    return res.json({
      message: "Outcome finded successfully",
      data: outcomeReq.data
    });
  }
  async indexMany(req, res) {
    const id = req.userId;
    const outcomeReq = await getAllOutcomesByUser({ userId: id });
    if (!outcomeReq || !outcomeReq.success) return res.status(400).json({ error: "Error finding outcomes" });
    return res.json({
      message: "Outcomes finded successfully",
      data: outcomeReq.data
    });
  }
  async update(req, res) {
    const { id, data } = req.body;
    const outcomeReq = await updateOutcome({ id, data });
    if (!outcomeReq || !outcomeReq.success) return res.status(400).json({ error: "Error updating outcome" });
    const categoryReq = await sumMoneySpent({ categoryId: data.categoryId });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error summing category" });
    return res.json({
      message: "Outcome updated successfully",
      data: outcomeReq.data
    });
  }
  async delete(req, res) {
    const { id } = req.body;
    const outcomeReq = await deleteOutcome({ id });
    if (!outcomeReq || !outcomeReq.success) return res.status(400).json({ error: "Error deleting outcome" });
    const categoryReq = await sumMoneySpent({ categoryId: outcomeReq.data.categoryId });
    if (!categoryReq || !categoryReq.success)
      return res.status(400).json({ error: "Error summing category" });
    return res.json({
      message: "Outcome deleted successfully",
      data: outcomeReq.data
    });
  }
  async indexByCategory(req, res) {
    const id = req.userId;
    const { categoryId } = req.body;
    const outcomeReq = await getOutcomesByCategory({ userId: id, categoryId });
    if (!outcomeReq || !outcomeReq.success)
      return res.status(400).json({ error: "Error finding outcome by categories" });
    return res.json({
      message: "Outcomes finded by category successfully",
      data: outcomeReq.data
    });
  }
};

// src/controllers/outcome-history-controller.ts
var outcomeHistoryController = class {
  async index(req, res) {
    const id = req.userId;
    const outcomeHistoryReq = await getUserOutcomeHistory({ userId: id });
    if (!outcomeHistoryReq || !outcomeHistoryReq.success)
      return res.status(400).json({ error: "Error finding outcome History" });
    return res.json({
      message: "Outcome history finded successfully",
      data: outcomeHistoryReq.data
    });
  }
  async store(req, res) {
    const id = req.userId;
    const outcomeHistoryReq = await createOutcomeHistory({ userId: id });
    if (!outcomeHistoryReq || !outcomeHistoryReq.success)
      return res.status(400).json({ error: "Error creating outcome History" });
    return res.json({
      message: "Outcome history created successfully",
      data: outcomeHistoryReq.data
    });
  }
  async updateTotals(req, res) {
    const { id } = req.body;
    const outcomeHistoryReq = await updateTotals2({ historyId: id });
    if (!outcomeHistoryReq || !outcomeHistoryReq.success)
      return res.status(400).json({ error: "Error updating outcome history" });
    return res.json({
      message: "Outcome history updated successfully",
      data: outcomeHistoryReq.data
    });
  }
};

// src/service/auth-service.ts
import { hash } from "bcrypt";
var hashPassword = async (password) => {
  return await hash(password, 8);
};

// src/controllers/user-controller.ts
var userController = class {
  async index(req, res) {
    const id = req.userId;
    const { email } = req.body;
    let userReq;
    if (!email) {
      userReq = await findUser({ id });
    } else {
      userReq = await findUser({ email });
    }
    if (!userReq || !userReq.success) return res.status(400).json({ error: "User not found" });
    return res.json({
      message: "User retrieved successfully",
      data: userViewModel(userReq.data)
    });
  }
  async store(req, res) {
    const { name, email, password } = req.body;
    const userExists = await findUser({ email });
    if (userExists) return res.status(400).json({ error: "User Already exist" });
    const hash_password = await hashPassword(password);
    const userReq = await createUser({ email, password: hash_password, name });
    if (!userReq || !userReq.success) return res.status(400).json({ error: "Error creating User" });
    const outcomeHistoryReq = await createOutcomeHistory({ userId: userReq.data.id });
    if (!outcomeHistoryReq || !outcomeHistoryReq.success)
      return res.status(400).json({ error: "Error creating outcome History" });
    const incomeHistoryReq = await createIncomeHistory({ userId: userReq.data.id });
    if (!incomeHistoryReq || !incomeHistoryReq.success)
      return res.status(400).json({ error: "Error creating income History" });
    return res.json({
      message: "User created successfully",
      data: userViewModel(userReq.data)
    });
  }
  async update(req, res) {
    const id = req.userId;
    const { name, email, password, avatarUrl } = req.body;
    const userExists = await findUser({ id });
    if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (email) {
      if (email !== userExists.data.email) {
        const emailExists = await findUser({ email });
        if (emailExists && emailExists.success) {
          return res.status(409).json({
            error: "Email already in use by another user"
          });
        }
        updateData.email = email;
      }
    }
    if (password) {
      const hash_password = await hashPassword(password);
      updateData.password = hash_password;
    }
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields to update"
      });
    }
    const userReq = await updateUser({ id, data: updateData });
    if (!userReq || !userReq.success) return res.status(500).json({ error: "Error updating user" });
    return res.json({
      message: "User updated successfully",
      data: userViewModel(userReq.data)
    });
  }
  async delete(req, res) {
    const id = req.userId;
    const userExists = await findUser({ id });
    if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });
    const userReq = await deleteUser(id);
    if (!userReq || !userReq.success) return res.status(400).json({ error: "Error deleting User" });
    return res.json({
      message: "User deleted successfully",
      data: userViewModel(userReq.data)
    });
  }
  async adjustBalance(req, res) {
    const id = req.userId;
    const { amount } = req.body;
    try {
      if (typeof amount !== "number") return res.status(400).json({ error: "Amount must be a number" });
      if (amount === 0) return res.status(400).json({ error: "Amount cannot be zero" });
      const userExists = await findUser({ id });
      if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });
      const balanceReq = await adjustBalance({ id, amount });
      if (!balanceReq.data || !balanceReq.success)
        return res.status(500).json({ error: "Error adjusting balance" });
      return res.json({
        message: amount > 0 ? "Balance increased successfully" : "Balance decreased successfully",
        previousBalance: userExists.data.balance,
        adjustment: amount,
        newBalance: balanceReq.data.balance
      });
    } catch (error) {
      console.error("Error in adjustBalance:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async adjustSaving(req, res) {
    const id = req.userId;
    const { amount } = req.body;
    try {
      if (typeof amount !== "number") return res.status(400).json({ error: "Amount must be a number" });
      if (amount === 0) return res.status(400).json({ error: "Amount cannot be zero" });
      const userExists = await findUser({ id });
      if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });
      const savingReq = await adjustSaving({ id, amount });
      if (!savingReq.data || !savingReq.success)
        return res.status(500).json({ error: "Error adjusting saving" });
      return res.json({
        message: amount > 0 ? "Saving increased successfully" : "Saving decreased successfully",
        previousSaving: userExists.data.saving,
        adjustment: amount,
        newSaving: savingReq.data.saving
      });
    } catch (error) {
      console.error("Error in adjustSaving:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async setBalance(req, res) {
    const id = req.userId;
    const { amount } = req.body;
    try {
      if (typeof amount !== "number") return res.status(400).json({ error: "Amount must be a number" });
      if (amount < 0) return res.status(400).json({ error: "Balance cannot be negative" });
      const userExists = await findUser({ id });
      if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });
      const balanceReq = await setBalance({ id, amount });
      if (!balanceReq.data || !balanceReq.success)
        return res.status(500).json({ error: "Error setting balance" });
      return res.json({
        message: "Balance set successfully",
        previousBalance: userExists.data.balance,
        newBalance: balanceReq.data.balance
      });
    } catch (error) {
      console.error("Error in setBalance:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async setSaving(req, res) {
    const id = req.userId;
    const { amount } = req.body;
    try {
      if (typeof amount !== "number") return res.status(400).json({ error: "Amount must be a number" });
      if (amount < 0) return res.status(400).json({ error: "Saving cannot be negative" });
      const userExists = await findUser({ id });
      if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });
      const savingReq = await setSaving({ id, amount });
      if (!savingReq.data || !savingReq.success)
        return res.status(500).json({ error: "Error setting saving" });
      return res.json({
        message: "Saving set successfully",
        previousSaving: userExists.data.saving,
        newSaving: savingReq.data.saving
      });
    } catch (error) {
      console.error("Error in setSaving:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

// src/middleware/auth.ts
import jwt2 from "jsonwebtoken";
function AuthMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Token not provided" });
  }
  const [, token] = authorization.split(" ");
  try {
    const decode = jwt2.verify(token, process.env.SECRETKEY);
    const { id } = decode;
    req.userId = id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid" });
  }
}

// src/controllers/income-history-controller.ts
var incomeHistoryController = class {
  async index(req, res) {
    const id = req.userId;
    const incomeHistoryReq = await getUserincomeHistory({ userId: id });
    if (!incomeHistoryReq || !incomeHistoryReq.success)
      return res.status(400).json({ error: "Error finding income History" });
    return res.json({
      message: "income history finded successfully",
      data: incomeHistoryReq.data
    });
  }
  async store(req, res) {
    const id = req.userId;
    const incomeHistoryReq = await createIncomeHistory({ userId: id });
    if (!incomeHistoryReq || !incomeHistoryReq.success)
      return res.status(400).json({ error: "Error creating income History" });
    return res.json({
      message: "income history created successfully",
      data: incomeHistoryReq.data
    });
  }
  async updateTotals(req, res) {
    const { id } = req.body;
    const incomeHistoryReq = await updateTotals({ historyId: id });
    if (!incomeHistoryReq || !incomeHistoryReq.success)
      return res.status(400).json({ error: "Error updating income history" });
    return res.json({
      message: "income history updated successfully",
      data: incomeHistoryReq.data
    });
  }
};

// src/service/goal-service.ts
var createGoal = async ({ data }) => {
  const goal = await prisma.goal.create({ data });
  if (goal) return { success: true, data: goal };
  return console.error("Error Creating new goal");
};
var getGoalById = async ({ id }) => {
  const goal = await prisma.goal.findFirst({
    where: { id },
    include: {
      goalProgress: true
    }
  });
  if (goal) return { success: true, data: goal };
  return console.error("Error finding the goal");
};
var getGoalsByUser = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      goalProgress: true
    }
  });
  if (goals) return { success: true, data: goals };
  return console.error("Error finding all the goals");
};
var updateGoal = async ({ id, data }) => {
  const goal = await prisma.goal.update({ where: { id }, data });
  if (goal) return { success: true, data: goal };
  return console.error("Error updating goal");
};
var deleteGoal = async ({ id }) => {
  const goal = await prisma.goal.delete({ where: { id } });
  if (goal) return { success: true, data: goal };
  return console.error("Error deleting goal");
};
var addGoalProgress = async ({ goalId, amount }) => {
  const goal = await prisma.goal.findFirst({ where: { id: goalId } });
  if (!goal) return console.error("Goal not found");
  const progress = await prisma.goalProgress.create({
    data: {
      goalId,
      amount
    }
  });
  const updatedGoal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      currentValue: goal.currentValue + amount
    }
  });
  if (progress && updatedGoal)
    return { success: true, data: { progress, goal: updatedGoal } };
  return console.error("Error adding progress to goal");
};
var getGoalStats = async ({ userId }) => {
  const user = await findUser({ id: userId });
  if (!user) return console.error("User dont exist");
  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      goalProgress: true
    }
  });
  const stats = goals.map((goal) => {
    const totalProgress = goal.goalProgress.reduce((acc, progress) => acc + progress.amount, 0);
    const progressPercentage = goal.targetValue > 0 ? goal.currentValue / goal.targetValue * 100 : 0;
    return {
      id: goal.id,
      name: goal.name,
      type: goal.type,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      calculatedProgress: totalProgress,
      progressPercentage: Math.min(progressPercentage, 100),
      status: goal.status,
      progressCount: goal.goalProgress.length
    };
  });
  if (stats) return { success: true, data: stats };
  return console.error("Error getting goal stats");
};

// src/controllers/goal-controller.ts
var goalController = class {
  async store(req, res) {
    const userId = req.userId;
    const goal = req.body;
    const goalReq = await createGoal({
      data: {
        ...goal,
        userId
      }
    });
    if (!goalReq || !goalReq.success)
      return res.status(400).json({ error: "Error creating goal" });
    return res.json({
      message: "Goal created successfully",
      data: goalReq.data
    });
  }
  async index(req, res) {
    const { id } = req.params;
    const goalReq = await getGoalById({ id });
    if (!goalReq || !goalReq.success)
      return res.status(400).json({ error: "Error finding goal" });
    return res.json({
      message: "Goal finded successfully",
      data: goalReq.data
    });
  }
  async indexMany(req, res) {
    const id = req.userId;
    const goalReq = await getGoalsByUser({ userId: id });
    if (!goalReq || !goalReq.success)
      return res.status(400).json({ error: "Error finding goals" });
    return res.json({
      message: "Goals finded successfully",
      data: goalReq.data
    });
  }
  async update(req, res) {
    const { id, data } = req.body;
    const goalReq = await updateGoal({ id, data });
    if (!goalReq || !goalReq.success)
      return res.status(400).json({ error: "Error updating goal" });
    return res.json({
      message: "Goal updated successfully",
      data: goalReq.data
    });
  }
  async delete(req, res) {
    const { id } = req.body;
    const goalReq = await deleteGoal({ id });
    if (!goalReq || !goalReq.success)
      return res.status(400).json({ error: "Error deleting goal" });
    return res.json({
      message: "Goal deleted successfully",
      data: goalReq.data
    });
  }
  async addProgress(req, res) {
    const { goalId, amount } = req.body;
    const goalReq = await addGoalProgress({ goalId, amount });
    if (!goalReq || !goalReq.success)
      return res.status(400).json({ error: "Error adding progress to goal" });
    return res.json({
      message: "Progress added successfully",
      data: goalReq.data
    });
  }
  async getGoalStats(req, res) {
    const id = req.userId;
    const goalReq = await getGoalStats({ userId: id });
    if (!goalReq || !goalReq.success)
      return res.status(400).json({ error: "Error getting stats from goal" });
    return res.json({
      message: "Goal stats getted successfully",
      data: goalReq.data
    });
  }
};

// src/service/transactions-service.ts
var getMonthlyTransactions = async ({
  userId,
  startDate,
  endDate
}) => {
  const user = await findUser({ id: userId });
  if (!user) {
    return console.error("User does not exist");
  }
  const dateFilter = {};
  if (startDate) dateFilter.gte = startDate;
  if (endDate) dateFilter.lte = endDate;
  const [incomeHistories, outcomeHistories] = await Promise.all([
    prisma.incomeHistory.findMany({
      where: {
        userId,
        ...Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }
      },
      orderBy: { createdAt: "asc" }
    }),
    prisma.outcomeHistory.findMany({
      where: {
        userId,
        ...Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }
      },
      orderBy: { createdAt: "asc" }
    })
  ]);
  const monthlyDataMap = /* @__PURE__ */ new Map();
  incomeHistories.forEach((income) => {
    const monthKey = getMonthKey(income.createdAt);
    if (!monthlyDataMap.has(monthKey)) {
      monthlyDataMap.set(monthKey, {
        date: new Date(income.createdAt.getFullYear(), income.createdAt.getMonth(), 1),
        totalIncome: 0,
        fixedIncome: 0,
        variableIncome: 0,
        totalOutcome: 0,
        fixedOutcome: 0,
        variableOutcome: 0,
        balance: 0
      });
    }
    const data = monthlyDataMap.get(monthKey);
    data.totalIncome = income.totalIncome;
    data.fixedIncome = income.fixedIncome;
    data.variableIncome = income.variableIncome;
  });
  outcomeHistories.forEach((outcome) => {
    const monthKey = getMonthKey(outcome.createdAt);
    if (!monthlyDataMap.has(monthKey)) {
      monthlyDataMap.set(monthKey, {
        date: new Date(outcome.createdAt.getFullYear(), outcome.createdAt.getMonth(), 1),
        totalIncome: 0,
        fixedIncome: 0,
        variableIncome: 0,
        totalOutcome: 0,
        fixedOutcome: 0,
        variableOutcome: 0,
        balance: 0
      });
    }
    const data = monthlyDataMap.get(monthKey);
    data.totalOutcome = outcome.totalOutcome;
    data.fixedOutcome = outcome.fixedOutcome;
    data.variableOutcome = outcome.variableOutcome;
  });
  const monthlyData = Array.from(monthlyDataMap.values()).map((data) => ({
    ...data,
    balance: data.totalIncome - data.totalOutcome
  })).sort((a, b) => a.date.getTime() - b.date.getTime());
  return { success: true, data: monthlyData };
};
var getTransactionsByMonth = async ({
  userId,
  year,
  month
}) => {
  const user = await findUser({ id: userId });
  if (!user) {
    return console.error("User does not exist");
  }
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  const [incomeHistory, outcomeHistory] = await Promise.all([
    prisma.incomeHistory.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        listOfIncomes: true
      }
    }),
    prisma.outcomeHistory.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        listOfOutcomes: {
          include: {
            category: true
          }
        }
      }
    })
  ]);
  const data = {
    date: startDate,
    totalIncome: incomeHistory?.totalIncome ?? 0,
    fixedIncome: incomeHistory?.fixedIncome ?? 0,
    variableIncome: incomeHistory?.variableIncome ?? 0,
    totalOutcome: outcomeHistory?.totalOutcome ?? 0,
    fixedOutcome: outcomeHistory?.fixedOutcome ?? 0,
    variableOutcome: outcomeHistory?.variableOutcome ?? 0,
    balance: (incomeHistory?.totalIncome ?? 0) - (outcomeHistory?.totalOutcome ?? 0)
  };
  return {
    success: true,
    data: {
      ...data,
      incomes: incomeHistory?.listOfIncomes ?? [],
      outcomes: outcomeHistory?.listOfOutcomes ?? []
    }
  };
};
var getMonthKey = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

// src/controllers/transaction-controller.ts
var TransactionController = class {
  async getMonthlyTransactions(req, res) {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    const params = { userId };
    if (startDate && typeof startDate === "string") {
      params.startDate = new Date(startDate);
    }
    if (endDate && typeof endDate === "string") {
      params.endDate = new Date(endDate);
    }
    const transactionsReq = await getMonthlyTransactions(params);
    if (!transactionsReq || !transactionsReq.success) {
      return res.status(400).json({
        error: "Error fetching monthly transactions"
      });
    }
    return res.json({
      message: "Monthly transactions fetched successfully",
      data: transactionsReq.data
    });
  }
  async getTransactionsByMonth(req, res) {
    const userId = req.userId;
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({
        error: "Year and month are required"
      });
    }
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    if (isNaN(yearNum) || isNaN(monthNum)) {
      return res.status(400).json({
        error: "Year and month must be valid numbers"
      });
    }
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        error: "Month must be between 1 and 12"
      });
    }
    const transactionsReq = await getTransactionsByMonth({
      userId,
      year: yearNum,
      month: monthNum
    });
    if (!transactionsReq || !transactionsReq.success) {
      return res.status(400).json({
        error: "Error fetching transactions for the specified month"
      });
    }
    return res.json({
      message: "Transactions for the month fetched successfully",
      data: transactionsReq.data
    });
  }
};

// src/routes/main-router.ts
var mainRouter = Router();
var userMainController = new userController();
var authMainController = new authController();
var outcomeMainController = new outcomeController();
var incomeMainController = new incomeController();
var outcomeHistoryMainController = new outcomeHistoryController();
var incomeHistoryMainController = new incomeHistoryController();
var categoryMainController = new categoryController();
var goalMainController = new goalController();
var transactionMainController = new TransactionController();
mainRouter.post("/auth/login", authMainController.authenticate);
mainRouter.post("/auth/register", userMainController.store);
mainRouter.post("/user/profile", AuthMiddleware, userMainController.index);
mainRouter.put("/user", AuthMiddleware, userMainController.update);
mainRouter.delete("/user", AuthMiddleware, userMainController.delete);
mainRouter.patch("/user/balance/adjust", AuthMiddleware, userMainController.adjustBalance);
mainRouter.put("/user/balance/set", AuthMiddleware, userMainController.setBalance);
mainRouter.patch("/user/saving/adjust", AuthMiddleware, userMainController.adjustSaving);
mainRouter.put("/user/saving/set", AuthMiddleware, userMainController.setSaving);
mainRouter.get("/transactions/monthly", AuthMiddleware, transactionMainController.getMonthlyTransactions);
mainRouter.get("/transactions/month", AuthMiddleware, transactionMainController.getTransactionsByMonth);
mainRouter.post("/outcome", AuthMiddleware, outcomeMainController.store);
mainRouter.get("/outcome/:id", AuthMiddleware, outcomeMainController.index);
mainRouter.get("/outcomes", AuthMiddleware, outcomeMainController.indexMany);
mainRouter.put("/outcome", AuthMiddleware, outcomeMainController.update);
mainRouter.delete("/outcome", AuthMiddleware, outcomeMainController.delete);
mainRouter.get("/outcomes/category", AuthMiddleware, outcomeMainController.indexByCategory);
mainRouter.post("/income", AuthMiddleware, incomeMainController.store);
mainRouter.get("/income/:id", AuthMiddleware, incomeMainController.index);
mainRouter.get("/incomes", AuthMiddleware, incomeMainController.indexMany);
mainRouter.put("/income", AuthMiddleware, incomeMainController.update);
mainRouter.delete("/income", AuthMiddleware, incomeMainController.delete);
mainRouter.get("/income/category", AuthMiddleware, incomeMainController.indexByCategory);
mainRouter.get("/outcome-history", AuthMiddleware, outcomeHistoryMainController.index);
mainRouter.post("/outcome-history", AuthMiddleware, outcomeHistoryMainController.store);
mainRouter.patch("/outcome-history/totals", AuthMiddleware, outcomeHistoryMainController.updateTotals);
mainRouter.get("/income-history", AuthMiddleware, incomeHistoryMainController.index);
mainRouter.post("/income-history", AuthMiddleware, incomeHistoryMainController.store);
mainRouter.patch("/income-history/totals", AuthMiddleware, incomeHistoryMainController.updateTotals);
mainRouter.post("/category/sum", AuthMiddleware, categoryMainController.sumMoneySpent);
mainRouter.get("/category/stats", AuthMiddleware, categoryMainController.getCategoryStats);
mainRouter.get("/categories", AuthMiddleware, categoryMainController.indexMany);
mainRouter.post("/category", AuthMiddleware, categoryMainController.store);
mainRouter.delete("/category", AuthMiddleware, categoryMainController.delete);
mainRouter.put("/category", AuthMiddleware, categoryMainController.update);
mainRouter.get("/category/:id", AuthMiddleware, categoryMainController.index);
mainRouter.post("/goal/progress", AuthMiddleware, goalMainController.addProgress);
mainRouter.get("/goal/stats", AuthMiddleware, goalMainController.getGoalStats);
mainRouter.get("/goal/:id", AuthMiddleware, goalMainController.index);
mainRouter.post("/goal", AuthMiddleware, goalMainController.store);
mainRouter.get("/goals", AuthMiddleware, goalMainController.indexMany);
mainRouter.put("/goal", AuthMiddleware, goalMainController.update);
mainRouter.delete("/goal", AuthMiddleware, goalMainController.delete);

// src/index.ts
var app = express();
var PORT = process.env.PORT || 3001;
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(mainRouter);
app.get("/", (req, res) => {
  res.json("hello world");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
