from transformers import DebertaTokenizer, DebertaForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset

# Load pre-trained model and tokenizer
tokenizer = DebertaTokenizer.from_pretrained('microsoft/deberta-base')
model = DebertaForSequenceClassification.from_pretrained('microsoft/deberta-base', num_labels=4)

# Load dataset from Hugging Face
dataset = load_dataset('ag_news')

# Tokenize the dataset
def tokenize(batch):
    return tokenizer(batch['text'], padding=True, truncation=True)

train_dataset, test_dataset = dataset['train'], dataset['test']
train_dataset = train_dataset.map(tokenize, batched=True, batch_size=len(train_dataset))
test_dataset = test_dataset.map(tokenize, batched=True, batch_size=len(test_dataset))

# Format the dataset to PyTorch tensors
train_dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])
test_dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])

# Define the training arguments
training_args = TrainingArguments(
    output_dir='./model/fine-tuned-zero-shot',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
)

# Create the Trainer and train
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset
)

trainer.train()
