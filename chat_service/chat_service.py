import fal
from pydantic import BaseModel


MODEL_NAME = "openlm-research/open_llama_13b"

class ChatOptions(BaseModel):
    prompt: str
    max_tokens: int = 100

class ChatResponse(BaseModel):
    response: str


@fal.cached
def prepare_engine(model_name: str = MODEL_NAME):
    """Prepare the LLM text generation engine using the specified model."""
    from vllm import LLM

    engine = LLM(model=model_name)
    return engine

@fal.function(
    virtualenv=".",
    requirements=["vllm", "torch==2.0.1"],
    machine_type="GPU",
    keep_alive=60,
    serve=True
)

def completion_service(options: ChatOptions) -> ChatResponse:
    """Generate text completion based on the input prompt and options."""
    from vllm import SamplingParams

    engine = prepare_engine()
    sampling_params = SamplingParams(max_tokens=options.max_tokens)

    result = engine.generate(options.prompt, sampling_params)
    completion = result[0].outputs[0].text  # Accessing the generated text.
    
    return ChatResponse(response=completion)


# if __name__ == "__main__":
#     fal.cli.serve("chat_service.py", "completion_service", alias="story-chat")
