# A simple app to test the OpenAI API

import os
from dotenv import load_dotenv
from openai import OpenAI
from flask import Flask, jsonify

load_dotenv()

app = Flask(__name__)

client = OpenAI()

@app.route('/prompt', methods=['GET'])
def prompt_openai():
    prompt = "What is the capital of the moon?"
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    
    completion_text = completion.choices[0].message.content.strip()
    tokens_used = completion.usage.total_tokens
    cost_estimate = tokens_used * 0.03 / 1000  # Assuming $0.03 per 1k tokens for gpt-4o-mini
    
    return jsonify({
        "completion": completion_text,
        "tokens_used": tokens_used,
        "cost_estimate": f"${cost_estimate:.4f}"
    })

if __name__ == '__main__':
    app.run(debug=True)
