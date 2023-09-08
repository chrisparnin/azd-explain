import { BasicApiConfiguration, RetryFunction, ThrottleFunction } from "modelfusion";

/**
 * Cconfiguration for the Azure OpenAI API. This class is responsible for constructing URLs specific to the Azure OpenAI deployment.
 * It creates URLs of the form
 * `https://[resourceName].openai.azure.com/openai/deployments/[deploymentId]/[path]?api-version=[apiVersion]`
 *
 * @see https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */
export class MyAzureOpenAIApiConfiguration extends BasicApiConfiguration {
  readonly apiKey?: string;

  constructor({
    apiKey,
    baseUrl,
    retry,
    throttle,
  }: {
    apiKey?: string;
    baseUrl: string;
    retry?: RetryFunction;
    throttle?: ThrottleFunction;
  }) {
    super({
      baseUrl: baseUrl,
      retry,
      throttle,
    });

    this.apiKey = apiKey;
  }

  assembleUrl(path: string): string {
    return `${this.baseUrl}`;
  }

  get headers(): Record<string, string> {
    return {
      "api-key": this.apiKey!,
      "ocp-apim-subscription-key": this.apiKey!
    };
  }
}