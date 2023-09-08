#!/usr/bin/env node

import { OpenAIChatSettings, OpenAIApiConfiguration, OpenAIChatMessage, OpenAIChatModel, streamText }  from "modelfusion";
import {MyAzureOpenAIApiConfiguration} from "./config";
import {ExecException, exec} from "child_process";
const chalk = require("chalk");
import axios  from "axios";
const args = process.argv.slice(2);
const userPrompt = args[0] || "A todo web app. I'm most comfortable with Microsoft technologies."

require("dotenv").config()

const apiKey = process.env.APIKEY;
const gpt4Key = process.env.GPT4KEY;
const AzureURL: string | undefined = process.env.AZURE_BASEURL;

console.log("Env", apiKey, gpt4Key, AzureURL);

(async () => {
  //const templates = await executeCommand("azd template list");

  const awesomeTemplatesUrl = 'https://azure.github.io/awesome-azd/templates.json';
  const data = await fetchAndParseJSON(awesomeTemplatesUrl);
  const promptified = data.map( (item: Record<string,string>) => `title: ${item.title} description: ${item.description}`).join('\n');
  select(promptified, userPrompt);
})();



async function fetchAndParseJSON(url: string) {
  try {
    const response = await axios.get(url);
    const jsonData = response.data;
    return jsonData;
  } catch (e) {
    const error = e as Error;
    console.error('Error fetching JSON:', error.message);
    throw error;
  }
}


async function select(templates: string, prompt: string) {

    /*
  const config: OpenAIChatSettings = { model: "gpt-3.5-turbo", 
    api: new OpenAIApiConfiguration({ 
      apiKey: apiKey,
  }), maxCompletionTokens: 100 };
  */
  const config: OpenAIChatSettings = {
    model: "gpt-4-32k",
    api: new MyAzureOpenAIApiConfiguration({
      apiKey: gpt4Key,
      baseUrl: AzureURL!
    })
  }

  const textStream = await streamText(
    new OpenAIChatModel(config),
    [
      OpenAIChatMessage.system(`
      You are an expert Azure devops engineer. Help a user select a template to get their new project started.
      The available templates are as follows: 
      ${templates}

      Please state the RepositoryPath or Title most relevant to the user's goal. Follow up with a simple and concise explanation with why the template was selected:
      `),
      OpenAIChatMessage.user(prompt),
    ]
  );

  console.log(":bust_in_silhouette::", chalk.green(prompt));

  console.log(":robot_face::")
  for await (const textFragment of textStream) {
    process.stdout.write(textFragment);
  }  
}


function executeCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {      
        if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        // You might choose to handle stderr separately, or ignore it
        console.error(`Command stderr: ${stderr}`);
      }

      resolve(stdout.trim()); // Trim any extra whitespace from the stdout
    });
  });
}