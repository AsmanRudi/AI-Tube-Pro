def youtube_prompt(keyword, language, duration):

    return f"""
Anda adalah YouTube Expert.

Buat konten YouTube.

Keyword:
{keyword}

Bahasa:
{language}

Durasi:
{duration}

Balas dalam format JSON.

{
"title":"",
"outline":[],
"script":"",
"description":"",
"tags":[]
}

"""