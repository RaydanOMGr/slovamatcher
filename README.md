# slovamatcher
Slovamatcher is a program to generate a lot of words using [slova](https://github.com/RaydanOMGr/slova) and find out what the probability for generating a certain world is.

## Config
```json
{
    "threads": 8,
    "wordsPerThread": 500000, 
    "wordSearched": "happy",
    "syllables": 2
}
```
The config has 4 fields: 
- threads: The amount of threads to use for generation and comparison, gigher values will cause greater stress on the gpu.
- wordsPerThread: The amount of words each thread should generate, higher values will increase the total time of generating words.
- wordSearched: The word that is being searched for to calculate the probability of it appearing
- syllables: The amount of syllables that a word has for slova to know how to generate it. Some words might be impossible to generate due to how slova works, an example is "fry". Entering an incorrect or invalid amount of syllables will stop the program from working.

 ## License
 Slovamatcher is licensed under the GNU General Public License v2.0
