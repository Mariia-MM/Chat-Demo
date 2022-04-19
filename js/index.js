import {createApp} from './vue.esm-browser.js'
//import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qpwswkughvlhhhetokoz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwd3N3a3VnaHZsaGhoZXRva296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAzOTcxOTQsImV4cCI6MTk2NTk3MzE5NH0.wMhV9epF5KusZU-_eWBEa1Q26ysJa1f_yyHvDEP-700'
const cli = supabase.createClient(supabaseUrl, supabaseKey)


createApp({
    data(){
        return{
            messages: [],
            name: '',
            newMessage: ''
        }
    },
    methods: {
        async downloadMessages(){            
            let { data: data, error } = await cli
                .from('Messages')
                .select('*')
                .order('created_at',{ ascendic: true})
            this.messages = data;            
        },
        async sendMessage(){
            const { data: data, error } = await cli
                .from('Messages')
                .insert([
                    {name:this.name, text:this.newMessage}
                ])
                //clean message
                this.newMessage='';
        },
        listenNewMessages(){
                        
            cli
                .from('Messages')
                .on('INSERT', payload => {
                    //adding new message
                    this.messages.push(payload.new);
                })
                .subscribe()

        }
    },
    mounted() {
        this.downloadMessages();
        this.listenNewMessages();
    },
    watch:{
        messages:{
            handler(newValue,oldValue){
                 //scroll
                 this.$nextTick(()=>{
                    const element = this.$refs.messagesContainer;
                    element.scrollTo(0,element.scrollHeight);
                 })
            },
            deep: true
        }
    }
}).mount('#app')