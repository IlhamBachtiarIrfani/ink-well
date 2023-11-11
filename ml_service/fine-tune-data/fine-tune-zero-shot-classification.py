from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset
import random

pretrained_model_name = '../model/zero-shot-classification-model-base'
output_model_name = '../model/fine-tuned-model'

# Load the NLI model and tokenizer
nli_model = AutoModelForSequenceClassification.from_pretrained(
    pretrained_model_name)
tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name)

# Load your dataset
your_dataset = load_dataset("jakartaresearch/indonews", split="train")
id2labels = ["bola", "news", "bisnis", "tekno", "otomotif"]
your_dataset = your_dataset.map(
    lambda x: {"class": x["label"]}, remove_columns=["label"])

# Define a function to create input sequences


def create_input_sequence(sample):
    text = sample["text"]
    label = sample["class"][0]
    contradiction_label = random.choice([x for x in id2labels if x != label])

    encoded_sequence = tokenizer(
        text*2,
        [f"This example is {label}.",
         f"This example is {contradiction_label}."],
        truncation=True,
        padding='max_length',
        max_length=512
    )
    encoded_sequence["labels"] = [2, 0] if random.random() > 0.5 else [0, 2]

    return encoded_sequence


# Prepare your dataset
train_dataset = your_dataset.map(
    create_input_sequence,
    batched=True,
    batch_size=1,
    remove_columns=["class", "text"]
)

# Define training arguments
training_args = TrainingArguments(
    output_dir=output_model_name,
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
)

# Create a Trainer instance
trainer = Trainer(
    model=nli_model,
    args=training_args,
    train_dataset=train_dataset,
)

# Train the model
trainer.train()

# Save the fine-tuned model
trainer.save_model(output_model_name)
tokenizer.save_pretrained(output_model_name)
