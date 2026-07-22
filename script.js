const selectProvedor = document.getElementById("provedor");
const selectRede = document.getElementById("rede");
const conteudo = document.getElementById("conteudo");

// Inputs da sidebar
const inputSlot1 = document.getElementById("slot1");
const inputSlot2 = document.getElementById("slot2");
const inputOnu = document.getElementById("onu");
const inputSerial = document.getElementById("serial");
const inputServicePort = document.getElementById("service_port");
const inputVlan = document.getElementById("vlan");
const inputDesc = document.getElementById("desc");

// Labels
const labelVlan = document.querySelector('label[for="vlan"]');
const labelServicePort = document.querySelector('label[for="service_port"]');

// Valores padrões
let slot1 = "1";
let slot2 = "7";
let slot = `${slot1}/${slot2}`;
let onu = "55";
let serial = "DACMECEC5C2EE";
let service_port = "Info_2";
let vlan = "Info_1";
let equip = 3;
let numero = "558420204039";
let pin = "541625533630007552";
let onuFormatado = "55";
let slot1Formatado = "01";
let slot2Formatado = "07";
let desc = "FGA2210";

let opcaoAtiva = "";

// Define opções de rede por provedor
const opcoesRede = {
    "CALIX": ["813G", "844G-L3"],
    "DATACOM": ["DATACOM"],
    "FURUKAWA": ["ZTE - NOKIA", "HUAWEI ", "FURUKAWA (FIOG)", "FURUKAWA (FISA)"],
    "HUAWEI": ["HUAWEI", "Huawei IPoE"],
    "NOKIA": ["Zyxel", "Vantiva/Nokia", "Brigde"],
    "PARKS": ["ROUTER_prks", "CFTV_prks"],
    "ZHONE": ["FGA2232", "FGA225C", "ZHONE"],
    "ZTE": ["ROUTER", "BRIGDE", "RAMAL"],
    "OUTROS": ["OUTROS"],

};

// Redes que devem exibir VLAN e Service Port
const redesComCampos = ["DATACOM", "HUAWEI", "Huawei IPoE", "Brigde", "BRIGDE", "PARKS", "RAMAL"];

// Atualiza visibilidade e placeholders dos campos
function atualizarCampos() {
    const provedor = selectProvedor.value;
    const redeSelecionada = selectRede.value;

    // Oculta ambos por padrão
    labelVlan.style.display = "none";
    inputVlan.style.display = "none";
    labelServicePort.style.display = "none";
    inputServicePort.style.display = "none";

    // Mostra apenas redes que precisam dos campos
    if (redesComCampos.includes(redeSelecionada)) {
        labelVlan.style.display = "block";
        inputVlan.style.display = "block";
        labelServicePort.style.display = "block";
        inputServicePort.style.display = "block";
    }

    // Altera placeholders e labels conforme provedor
    switch (provedor) {

        case "DATACOM":
            labelVlan.textContent = "VLAN:";
            inputVlan.placeholder = "VLAN";
            labelServicePort.textContent = "Contrato:";
            inputServicePort.placeholder = "Contrato";
            break;

        case "NOKIA":
            labelVlan.textContent = "VLAN:";
            inputVlan.placeholder = "VLAN";
            labelServicePort.textContent = "VLAN:";
            inputServicePort.placeholder = "VLAN";
            break;

        case "HUAWEI":
            labelVlan.textContent = "Service Port:";
            inputVlan.placeholder = "Service Port";
            labelServicePort.textContent = "VLAN:";
            inputServicePort.placeholder = "VLAN";
            break;

        case "PARKS":
            labelVlan.textContent = "Password:";
            inputVlan.placeholder = "Password";
            labelServicePort.textContent = "Username:";
            inputServicePort.placeholder = "Username";
            break;

        default:
            labelVlan.textContent = "VLAN:";
            inputVlan.placeholder = "VLAN";
            labelServicePort.textContent = "Service Port / Contrato:";
            inputServicePort.placeholder = "Service Port / Contrato";
            break;
    }

    switch (redeSelecionada) {

       case "BRIGDE":
            labelVlan.textContent = "";
            inputVlan.placeholder = "VLAN";
            labelServicePort.textContent = "VLAN:";
            inputServicePort.placeholder = "VLAN";
            break;

        case "ROUTER":
            labelVlan.textContent = "VLAN:";
            inputVlan.placeholder = "VLAN";
            labelServicePort.textContent = "VLAN:";
            inputServicePort.placeholder = "VLAN";
            break;

        case "RAMAL":
            labelVlan.textContent = "USERNAME:";
            inputVlan.placeholder = "USERNAME";
            labelServicePort.textContent = "PASSWORD:";
            inputServicePort.placeholder = "PASSWORD";
            break;
    }
}

// Detecta mudança no provedor
selectProvedor.addEventListener("change", () => {
    const provedor = selectProvedor.value;
    opcaoAtiva = provedor;

    // Limpa e atualiza opções de rede
    selectRede.innerHTML = "";
    if (opcoesRede[provedor]) {
        opcoesRede[provedor].forEach(rede => {
            const option = document.createElement("option");
            option.value = rede;
            option.textContent = rede;
            selectRede.appendChild(option);
        });
    } else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Selecione a rede";
        selectRede.appendChild(option);
    }

    atualizarCampos();
    mostrarInfo();
});

// Detecta mudança na rede
selectRede.addEventListener("change", () => {
    atualizarCampos();
    mostrarInfo();
});

// Atualiza os valores sempre que digitar na sidebar
[inputSlot1, inputSlot2, inputOnu, inputSerial, inputServicePort, inputVlan, inputDesc].forEach(input => {
    input.addEventListener("input", () => {
        slot1 = inputSlot1.value || "1";
        slot2 = inputSlot2.value || "7";
        slot = `${slot1}/${slot2}`;
        slot1Formatado = slot1.padStart(2, "0");
        slot2Formatado = slot2.padStart(2, "0");
        onu = inputOnu.value || "55";
        onuFormatado = onu.padStart(2, "0");
        serial = inputSerial.value || "DACMECEC5C2EE";
        service_port = inputServicePort.value || "Info_2";
        vlan = inputVlan.value || "Info_1";
        desc = inputDesc.value || "FGA2210";

        mostrarInfo();
    });
});

// Função que atualiza o conteúdo de comandos
function mostrarInfo() {
    const provedor = selectProvedor.value;
    const rede = selectRede.value;

    let info = "";

    if (provedor && rede) {

  switch (provedor) {
            case "CALIX":
 
  info = `####################### COMANDOS #######################

Verificar ont não provisionada:
show ont unassigned
 
Verificar ONT pelo FSAN:
show ont serial-number ${serial}

Verificar ONTs pela posição:
show ont discovered on-gpon-port ${slot}
 
Verificar detalhes de ONT específica:
show ont 59${slot1Formatado}${slot2Formatado}${onuFormatado} detail
 
Verificar VLAN de ONT:
show ont 59${slot1Formatado}${slot2Formatado}${onuFormatado} vlans
 
Verificar posição de ONT ID:
show ont 59${slot1Formatado}${slot2Formatado}${onuFormatado} ont-pon-us-cos
 
Verificar IP em uma ONT especifica:
show dhcp leases ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/G1 detail
 
VERIFICAR ONTs NA PON:
show ont on-gpon-port ${slot}

Reiniciar ONT:
reset ont 59${slot1Formatado}${slot2Formatado}${onuFormatado}

Desabilitar alarmes:
set session tca-notif disabled alarm-notif disabled event-notif disabled pager disabled timeout disabled

####################### DESPROVISIONAR #######################

delete ont 59${slot1Formatado}${slot2Formatado}${onuFormatado} forced

####################### PROVISIONAMENTO #######################
`;

    if (rede === "813G") {
        info += `
create ont 59${slot1Formatado}${slot2Formatado}${onuFormatado} profile 813G serial-number ${serial} admin-state enabled
`;
    } else if (rede === "844G-L3") {
        info += `
create ont 59${slot1Formatado}${slot2Formatado}${onuFormatado} profile 844G-L3 serial-number ${serial} admin-state enabled
`;
    }

    // Bloco que sempre aparece (independente do perfil escolhido)
    info += `
set ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/G1 mgmt-mode external instance rg-3
set ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/G1 rg-mgmt-profile Rg-Mgmt-Prof-1
add eth-svc Data1 to-ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/G1 bw-profile 1000991000 svc-tag-action TA-V-301-L3 admin-state enabled
set ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/G1 eth-svc Data1 bw-profile 1000991000
remove ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/g2 from-res-gw

####################### ATIVAÇÃO TELEFONIA #####################

add eth-svc Data3 to-ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/g2 bw-profile PHONE-E1 svc-tag-action TA-V-298-L2 admin-state enabled

####################### ATIVAÇÃO TV  #######################

add eth-svc Data2 to-ont-port 59${slot1Formatado}${slot2Formatado}${onuFormatado}/G1 bw-profile IPTV svc-tag-action TA-V-299 mcast-profile IPTV-MCast-Prof-1 admin-state enabled

`;
                break;

            case "DATACOM":
                info = `##################### COMANDOS DATACOM #####################

ONUS DESPROVISIONADAS
show interface gpon discovered-onus

CONSULTAR ONU
show interface gpon onu | include ${serial}

CONSULTAR SERVICE PORT 
show service-port gpon 1/${slot}

LISTAR ONUS
show interface gpon 1/${slot} onu ${onu}

#################### PROVISIONAR DATACOM #####################
    
config terminal
interface gpon 1/${slot}  
onu ${onu}
name ${service_port}
serial-number ${serial}
line-profile ${vlan}_1000_b
ethernet 1
negotiation
no shutdown
native vlan vlan-id ${vlan}
commit

exit

service-port new

gpon 1/${slot} onu ${onu} gem 2 description ${service_port} match vlan vlan-id ${vlan} action vlan replace vlan-id ${vlan}
commit
 
##################### DESPROVISIONAR #####################

config
interface gpon 1/${slot} 
no onu ${onu} 
top
no service-port ${onu}
commit

exit
`;
                break;

        case "FURUKAWA":
info = `enable
show onu info ${slot1}

`;

    if (rede === "ZTE - NOKIA") {
        info += `####################### ZTE - NOKIA #######################
conf t
gpon
gpon ${slot1}
traffic-profile tp_${slot1}-${onu} create
tcont 1
gemport 1/1 queue 1
dba-profile sr_M1000
queue 1 weight 20
mapper 1
gemport count 1
dscp-to-pbit enable
gemport count 1
bridge 1
ani mapper 1
vlan-filter vid 101 untagged discard
apply
!
onu-profile op_${slot1}-${onu} create
traffic-profile tp_${slot1}-${onu}
apply
!
gpon-olt ${slot1}
onu add ${onu} ${serial} auto-learning
onu-profile ${onu} op_${slot1}-${onu}
!
end
copy running-config startup-config

####################### REFAZER PERFIL #######################

conf t
gpon
gpon ${slot1}
no onu ${onu}
exit
no onu-profile op_${slot1}-${onu}
no traffic-profile tp_${slot1}-${onu}
end
conf t
gpon
gpon ${slot1}
traffic-profile tp_${slot1}-${onu} create
tcont 1
gemport 1/1 queue 1
dba-profile sr_M1000
queue 1 weight 20
tcont 2
gemport 2/1
dba-profile sr_k0512
mapper 1
gemport count 1
dscp-to-pbit enable
mapper 2
gemport count 1
bridge 1
ani mapper 1
vlan-filter vid 101 untagged discard
ani mapper 2
vlan-filter vid 201 untagged discard
uni virtual-eth 1
extended-vlan-tagging-operation evto1_hsi_voip_iptv
apply
!
onu-profile op_${slot1}-${onu} create
traffic-profile tp_${slot1}-${onu}
apply
!
gpon-olt ${slot1}
onu add ${onu} ${serial} auto-learning
onu-profile ${onu} op_${slot1}-${onu}
!
end
copy running-config startup-config
`;
    } else if (rede === "HUAWEI ") {
        info += `####################### HUAWEI #######################

conf t
gpon
gpon ${slot1}
traffic-profile tp_${slot1}-${onu} create
tcont 1
gemport 1/1 queue 1
dba-profile sr_M1000
queue 1 weight 20
mapper 1
gemport count 1
dscp-to-pbit enable
cos-mapping cos 2 gemport 1
bridge 1
ani mapper 1
uni virtual-eth 1
vlan-operation us-oper overwrite 101 2
mac-filter ipx net-beui apple-talk pppoe
tcont 2
gemport 2/1 queue 1
dba-profile sr_k0512
queue 1 weight 50
mapper 2
gemport count 1
dscp-to-pbit enable
cos-mapping cos 5 gemport 1
bridge 2
ani mapper 2
uni virtual-eth 2
vlan-operation us-oper add 201 5
mac-filter ipx net-beui apple-talk pppoe
apply
!
onu-profile op_${slot1}-${onu} create
traffic-profile tp_${slot1}-${onu}
apply
!
gpon-olt ${slot1}
onu add ${onu} ${serial} auto-learning
onu-profile ${onu} op_${slot1}-${onu}
!
end
copy running-config startup-config

####################### REFAZER PERFIL #######################

conf t
gpon
gpon ${slot1}
no onu ${onu}
exit
no onu-profile op_${slot1}-${onu}
no traffic-profile tp_${slot1}-${onu}
end
conf t
gpon
gpon ${slot1}
traffic-profile tp_${slot1}-${onu}
tcont 1
gemport 1/1 queue 1
dba-profile sr_M1000
queue 1 weight 20
mapper 1
gemport count 1
dscp-to-pbit enable
cos-mapping cos 2 gemport 1
bridge 1
ani mapper 1
uni virtual-eth 1
vlan-operation us-oper overwrite 101 2
mac-filter ipx net-beui apple-talk pppoe
tcont 2
gemport 2/1 queue 1
dba-profile sr_k0512
queue 1 weight 50
mapper 2
gemport count 1
dscp-to-pbit enable
cos-mapping cos 5 gemport 1
bridge 2
ani mapper 2
uni virtual-eth 2
vlan-operation us-oper add 201 5
mac-filter ipx net-beui apple-talk pppoe
apply
!
onu-profile op_${slot1}-${onu} create
traffic-profile tp_${slot1}-${onu}
apply
!
gpon-olt ${slot1}
onu add ${onu} ${serial} auto-learning
onu-profile ${onu} op_${slot1}-${onu}
!
end
copy running-config startup-config

`;
    } else if (rede === "FURUKAWA (FIOG)") {
        info += `####################### INTERNET + VOZ FURUKAWA (FIOG) #######################


`;
   } else if (rede === "FURUKAWA (FISA)") {
        info += `####################### INTERNET + VOZ FURUKAWA (FISA) #######################


`;
    }

    // Bloco que sempre aparece (independente do perfil escolhido)
    info += `####################### EXCLUIR #######################
	
conf t
gpon
gpon ${slot1}
no onu ${onu}
exit
no onu-profile op_${slot1}-${onu}
no traffic-profile tp_${slot1}-${onu}
end
`;

     break;



            case "HUAWEI":
                info = 
`####################### COMANDOS HUAWEI #######################

Consultar service port
display service-port port 0/${slot} ont ${onu}

consultar ONU desprovisionadas
display ont autofind all			

Consultar card/pon
display ont info 0 ${slot1} ${slot2} all

consultar onde a equipamento está provisionamento
display ont info by-sn ${serial}

Log
display ont info summary 0/${slot}

--------------------------------------------------------------------------

	display ont info by-sn 485754434C098DAA 								
  		F/S/P: 0/1/22 (Chassi / card [placa] / porta pon)			
  		ONT-ID: 333	(ID da onu)

--------------------------------------------------------------------------
`;

    if (rede === "HUAWEI") {
        info += 
`####################### PROVISIONAMENTO Brigde #######################

enable

config

interface gpon 0/${slot1}
ont add ${slot2} ${onu} sn-auth ${serial} omci ont-lineprofile-id 1010 ont-srvprofile-id 1010

display service-port next-free-index

service-port ${vlan} vlan ${service_port} gpon 0/${slot1}/${slot2} ont ${onu} gemport 1 multi-service user-vlan 11 tag-transform translate inbound traffic-table index 50 outbound traffic-table index 50
save
`;
    } else if (rede === "Huawei IPoE") {
        info += 
`####################### PROVISIONAMENTO IPoE #######################

config
interface gpon 0/${slot1} 
ont add ${slot2} ${onu} sn-auth ${serial} omci ont-lineprofile-id 301 ont-srvprofile-id 301 desc "${serial}"
ont ipconfig ${slot2} ${onu} ip-index 1 dhcp vlan 301 priority 0
ont internet-config ${slot1} ${slot2} ip-index 1
ont wan-config ${slot2} ${onu} ip-index 1 profile-id 0
ont tr069-server-config ${slot2} ${onu} profile-id 10
ont port route ${slot2} ${onu} eth 1 enable
ont port route ${slot2} ${onu} eth 2 enable
ont port route ${slot2} ${onu} eth 3 enable
ont port route ${slot2} ${onu} eth 4 enable
quit

display service-port next-free-index

service-port ${service_port} vlan 301 gpon 0/${slot} ont ${onu} gemport 1 multi-service user-vlan 301 tag-transform translate inbound traffic-table index 50 outbound traffic-table index 50
`;
    }

    // Bloco que sempre aparece (independente do perfil escolhido)
    info += 
`####################### DESPROVISIONAR #######################

enable  
config 
undo service-port port 0/${slot} ont ${onu}
interface gpon 0/${slot1}
ont delete ${slot2} ${onu}
quit

`;
                break;


            case "NOKIA":


    if (rede === "Zyxel") {
        info += `
####################### COMANDOS OLT NOKIA #######################

show equipment ont index sn:${serial}

show equipment ont status pon 1/1/${slot}

admin equipment ont interface 1/1/${slot}/${onu} reboot with-active-image
--------------------

show equipment ont optics 1/1/${slot}/${onu}

show vlan bridge-port-fdb 1/1/${slot}/${onu}/${equip}/1

show dhcp-relay session vlanport:1/1/${slot}/${onu}/${equip}/1:301
show dhcp-relay session vlanport:1/1/${slot}/${onu}/${equip}/1:299

show equipment ont status pon 1/1/${slot} ont 1/1/${slot}/${onu}

show equipment ont cfg-download 1/1/${slot}/${onu}

--------------------
Comandos telefonia

show dhcp-relay session vlanport:1/1/${slot}/${onu}/vuni:298
info configure voice ont voice-sip-port 1/1/${slot}/${onu}/6/1
show voice ont pots operational-data 1/1/${slot}/${onu}/6/1

####################### PROVISIONAMENTO Zyxel #######################

configure equipment ont interface 1/1/${slot}/${onu} sernum ${serial} subslocid WILDCARD fec-up disable sw-dnload-version disabled sw-ver-pland disabled voip-allowed iphost iphc-allowed enable

###################### DESPROVISIONAMENTO #######################

configure equipment ont interface 1/1/${slot}/${onu} admin-state down
configure equipment ont no interface 1/1/${slot}/${onu}

####################### ATIVAÇÃO TV #######################
	  ⚠️⚠️⚠️ ENVIAR LINHA POR LINHA ⚠️⚠️⚠️ 

configure qos interface 1/1/${slot}/${onu}/${equip}/1 upstream-queue 3 bandwidth-profile name:vel_100M_1M_UP

configure qos interface ont:1/1/${slot}/${onu} queue 3 shaper-profile name:vel_100M_1M_DOWN

configure bridge port 1/1/${slot}/${onu}/${equip}/1 vlan-id 299 tag single-tagged

configure igmp channel vlan:1/1/${slot}/${onu}/${equip}/1:299 max-num-group 10

##################### ATIVAÇÃO TELEFONIA #####################
  ⚠️⚠️⚠️ CASO ERRO, TENTAR ENVIAR LINHA POR LINHA ⚠️⚠️⚠️ 

configure qos interface 1/1/${slot}/${onu}/voip upstream-queue 2 bandwidth-profile name:vel_1M_1M_IN
configure equipment ont slot 1/1/${slot}/${onu}/2 plndnumdataports 0 plndnumvoiceports 2 planned-card-type pots admin-state down
configure bridge port 1/1/${slot}/${onu}/vuni max-unicast-mac 2
configure bridge port 1/1/${slot}/${onu}/vuni vlan-id 298
configure bridge port 1/1/${slot}/${onu}/vuni pvid 298
configure iphost ont ont:1/1/${slot}/${onu}/1 dhcp enabled vlan 298
configure iphost ont ont:1/1/${slot}/${onu}/1 admin-state up
configure voice ont voip-config ont:1/1/${slot}/${onu}/1 protocol sip
configure voice ont sip-config ont:1/1/${slot}/${onu}/1 proxyserv-prof 2 aor-host-prt-prof 3 registrar-prof 2 reg-expire-time 1800 uri-format sip-uri
configure interface port voip:1/1/${slot}/${onu} admin-up
configure equipment ont slot 1/1/${slot}/${onu}/2 admin-state up
configure voice ont voice-port 1/1/${slot}/${onu}/2/1 admin-state locked
configure voice ont voice-port 1/1/${slot}/${onu}/2/1 custinfo POTS1 voipconfig sip pots-pwr-timer 300 rx-gain 1.000000 tx-gain 2.000000 impedance 600 voip-media-prof 1
configure voice ont voice-sip-port 1/1/${slot}/${onu}/2/1 user-aor ${numero} display-name ${numero} user-name ${numero} password plain:${pin} voice-mail-prof 2 ntwk-dp-prof 1 app-serv-prof 1 ac-code-prof 1
configure voice ont voice-port 1/1/${slot}/${onu}/2/1 admin-state unlocked

`;
    } else if (rede === "Vantiva/Nokia") {
        info += `
####################### COMANDOS OLT NOKIA #######################

show equipment ont index sn:${serial}

show equipment ont status pon 1/1/${slot}

admin equipment ont interface 1/1/${slot}/${onu} reboot with-active-image
--------------------

show equipment ont optics 1/1/${slot}/${onu}

show vlan bridge-port-fdb 1/1/${slot}/${onu}/${equip}/1

show dhcp-relay session vlanport:1/1/${slot}/${onu}/${equip}/1:301
show dhcp-relay session vlanport:1/1/${slot}/${onu}/${equip}/1:299

show equipment ont status pon 1/1/${slot} ont 1/1/${slot}/${onu}

show equipment ont cfg-download 1/1/${slot}/${onu}

--------------------
Comandos telefonia

show dhcp-relay session vlanport:1/1/${slot}/${onu}/vuni:298
info configure voice ont voice-sip-port 1/1/${slot}/${onu}/6/1
show voice ont pots operational-data 1/1/${slot}/${onu}/6/1

####################### PROVISIONAMENTO Vantiva/Nokia #######################

configure equipment ont interface 1/1/${slot}/${onu} sernum ${serial} subslocid WILDCARD fec-up disable sw-dnload-version auto sw-ver-pland auto voip-allowed iphost pland-cfgfile1 auto pland-cfgfile2 auto dnload-cfgfile1 auto dnload-cfgfile2 auto desc1 "${desc}"

###################### DESPROVISIONAMENTO #######################

configure equipment ont interface 1/1/${slot}/${onu} admin-state down
configure equipment ont no interface 1/1/${slot}/${onu}

####################### ATIVAÇÃO TV #######################
	  ⚠️⚠️⚠️ ENVIAR LINHA POR LINHA ⚠️⚠️⚠️ 

configure qos interface 1/1/${slot}/${onu}/${equip}/1 upstream-queue 3 bandwidth-profile name:vel_100M_1M_UP

configure qos interface ont:1/1/${slot}/${onu} queue 3 shaper-profile name:vel_100M_1M_DOWN

configure bridge port 1/1/${slot}/${onu}/${equip}/1 vlan-id 299 tag single-tagged

configure igmp channel vlan:1/1/${slot}/${onu}/${equip}/1:299 max-num-group 10

##################### ATIVAÇÃO TELEFONIA #####################
  ⚠️⚠️⚠️ CASO ERRO, TENTAR ENVIAR LINHA POR LINHA ⚠️⚠️⚠️ 

configure qos interface 1/1/${slot}/${onu}/voip upstream-queue 2 bandwidth-profile name:vel_1M_1M_IN
configure equipment ont slot 1/1/${slot}/${onu}/2 plndnumdataports 0 plndnumvoiceports 2 planned-card-type pots admin-state down
configure bridge port 1/1/${slot}/${onu}/vuni max-unicast-mac 2
configure bridge port 1/1/${slot}/${onu}/vuni vlan-id 298
configure bridge port 1/1/${slot}/${onu}/vuni pvid 298
configure iphost ont ont:1/1/${slot}/${onu}/1 dhcp enabled vlan 298
configure iphost ont ont:1/1/${slot}/${onu}/1 admin-state up
configure voice ont voip-config ont:1/1/${slot}/${onu}/1 protocol sip
configure voice ont sip-config ont:1/1/${slot}/${onu}/1 proxyserv-prof 2 aor-host-prt-prof 3 registrar-prof 2 reg-expire-time 1800 uri-format sip-uri
configure interface port voip:1/1/${slot}/${onu} admin-up
configure equipment ont slot 1/1/${slot}/${onu}/2 admin-state up
configure voice ont voice-port 1/1/${slot}/${onu}/2/1 admin-state locked
configure voice ont voice-port 1/1/${slot}/${onu}/2/1 custinfo POTS1 voipconfig sip pots-pwr-timer 300 rx-gain 1.000000 tx-gain 2.000000 impedance 600 voip-media-prof 1
configure voice ont voice-sip-port 1/1/${slot}/${onu}/2/1 user-aor ${numero} display-name ${numero} user-name ${numero} password plain:${pin} voice-mail-prof 2 ntwk-dp-prof 1 app-serv-prof 1 ac-code-prof 1
configure voice ont voice-port 1/1/${slot}/${onu}/2/1 admin-state unlocked
`;
    } else if (rede === "Brigde") {
        info += `
show equipment ont index sn:${serial}

show equipment ont status pon 1/1/${slot}

show equipment ont optics 1/1/${slot}/${onu}

show vlan bridge-port-fdb 1/1/${slot}/${onu}/${equip}/1

show dhcp-relay session vlanport:1/1/${slot}/${onu}/${equip}/1:301

show equipment ont status pon 1/1/${slot} ont 1/1/${slot}/${onu}

#################### PROVISIONAR #####################

configure equipment ont interface 1/1/${slot}/${onu} sernum ZTEG:D872FE4D sw-ver-pland disabled optics-hist enable
admin-state up
exit all

configure equipment ont slot 1/1/${slot}/${onu}/1 planned-card-type ethernet plndnumdataports 1 plndnumvoiceports 0 admin-state up
exit all

configure qos interface 1/1/${slot}/${onu}/1/1 upstream-queue 0 bandwidth-profile name:HSI_1G_UP
exit all

configure interface port uni:1/1/${slot}/${onu}/1/1 admin-up
exit all

configure bridge port 1/1/${slot}/${onu}/1/1 max-unicast-mac 32 max-committed-mac 1
vlan-id ${service_port}
exit
pvid ${service_port}
exit all


####################### DESPROVISIONAMENTO #######################

configure equipment ont interface 1/1/${slot}/${onu} admin-state down
configure equipment ont no interface 1/1/${slot}/${onu}
`;
    }
                break;
            case "PARKS":
                info = `####################### PARKS #######################

BUSCAR ONU PELO SERIAL
show gpon onu ${serial} summary

LISTAR DESPROVISIONADAS
show gpon onu unconfigured

CONSULTAR FLOWS
show gpon profile flow

VERIFICAR ATENUAÇÃO PELO SLOT/PON
show interface gpon${slot} onu status

VERIFICAR ATENUAÇÃO PELO SERIAL
show gpon onu ${serial} status
`;

if (rede === "ROUTER_prks") {
        info += 
`####################### PROVISIONAMENTO #######################

configure terminal
interface gpon${slot}
onu add serial-number ${serial}
onu ${serial} flow-profile parks411_501

onu ${serial} iphost 1 pppoe username ${service_port} password ${vlan}
onu ${serial} tr069-profile tr069
onu ${serial} tr069-admin-state unlock

do copy running-config startup-config
`;}

else if (rede === "CFTV_prks") {
        info += 
`####################### PROVISIONAMENTO #######################

conf t
interface gpon${slot}
onu add serial-number ${serial}
onu ${serial} flow-profile cftv_501
onu ${serial} vlan-translation-profile vt_501 uni-port 1,2,3,4
do copy running-config startup-config
end
`;
}

 info += 
`####################### DESPROVISIONAMENTO #######################

conf t
interface gpon${slot}
no onu ${serial}
end
`;

break;




            case "ZHONE":
                info = `####################### COMANDOS #######################

Listar card/pon
onu status ${slot}

Listar desprovisionadas
onu show ${slot}

Velocidade clientes
onu gemports ${slot}/${onu}

Verificar potencia/modelo ONT
onu inventory ${slot}/${onu}

Consultar potencia
onu status ${slot}/${onu}

Mostra se está UP e se pegou IP
bridge show 1-${slot1}-${slot2}-${onu}

Buscar ONU pelo serial
onu find fsan ${serial}

Realizar Recover
onu recover 1-${slot1}-${slot2}-${onu}

Realizar Reset
onu reboot 1-${slot1}-${slot2}-${onu}
`;

    if (rede === "FGA2232") {
        info += `
####################### PROVISIONAMENTO FGA2232 #######################

onu set ${slot}/${onu} vendorid ZNTS serno fsan ${serial} meprof TECH_FGA2232_R genprof TECH_FGA2232_R
gpononu profile create spec ${slot}/${onu} TECH_FGA2232_R TECH_FGA2232_R

bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 9${onuFormatado} gtp 100881 downlink-video vlan 299 tagged video 0/10 ipktrule 9 epktrule 100881
bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 5${onuFormatado} gtp 1000991000 downlink vlan 301 tagged ipktrule 5 epktrule 1000991000 maxunicast 3
bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 7${onuFormatado} gtp 700 downlink-voice vlan 298 tagged ipktrule 7
onu resync 1-${slot1}-${slot2}-${onu}

####################### PROVISIONAMENTO/CONFIGURAÇÃO TELEFONE #######################

bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 7${onuFormatado} gtp 700 downlink-voice vlan 298 tagged ipktrule 7


onu profile update spec 1-${slot1}-${slot2}-${onu}

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 21

"POTS1 Dial Number [0]"  : 558520100334

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 22

"POTS1 User Name [0]"  : 558520100334

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 23

"POTS1 Password [0]"  : 30062336738250852760

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 40

"POTS 1 Admin Status [1]"  : 0

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 33

"SIP Proxy IP [189.124.133.228]"  : 189.124.133.228

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 38

"SIP Registrar [189.124.133.228]"  : 189.124.133.228

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: s



`;
    } else if (rede === "FGA225C") {
        info += `
####################### PROVISIONAMENTO FGA225C #######################

onu set ${slot}/${onu} vendorid ZNTS serno fsan ${serial} meprof VANT_FGA225C_R genprof VANT_FGA225C_R
gpononu profile create spec ${slot}/${onu}  VANT_FGA225C_R VANT_FGA225C_R

bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 9${onuFormatado} gtp 100881 downlink-video vlan 299 tagged video 0/10 ipktrule 9 epktrule 100881
bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 5${onuFormatado} gtp 1000991000 downlink vlan 301 tagged ipktrule 5 epktrule 1000991000 maxunicast 3
bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 7${onuFormatado} gtp 700 downlink-voice vlan 298 tagged ipktrule 7
onu resync 1-${slot1}-${slot2}-${onu}

####################### PROVISIONAMENTO/CONFIGURAÇÃO TELEFONE #######################

bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 7${onuFormatado} gtp 700 downlink-voice vlan 298 tagged ipktrule 7


onu profile update spec 1-${slot1}-${slot2}-${onu}

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 21

"POTS1 Dial Number [0]"  : 558520100334

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 22

"POTS1 User Name [0]"  : 558520100334

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 23

"POTS1 Password [0]"  : 30062336738250852760

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 40

"POTS 1 Admin Status [1]"  : 0

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 33

"SIP Proxy IP [189.124.133.228]"  : 189.124.133.228

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: 38

"SIP Registrar [189.124.133.228]"  : 189.124.133.228

Enter OMCI edit command or [s]ave, [q]uit, [h]elp: s


`;
    } else if (rede === "ZHONE") {
        info += `
####################### PROVISIONAMENTO ZHONE #######################

onu set ${slot}/${onu} vendorid ZNTS serno fsan ${serial} meprof zhone-2428
cpe system add ${slot}/${onu} sys-common-profile IPTVFw

bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 3${onuFormatado} gtp 1000991000 downlink vlan 301 tagged ipktrule 5 epktrule 1000991000 rg-brouted eth [1-4] maxunicast 3 
bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 3${onuFormatado} gtp 1000991000 downlink vlan 301 tagged ipktrule 5 epktrule 1000991000 rg-brouted wlan 1 
bridge add 1-${slot1}-${slot2}-${onu}/gpononu gem 3${onuFormatado} gtp 1000991000 downlink vlan 301 tagged ipktrule 5 epktrule 1000991000 rg-brouted wlan 5
`;
    }

    // Bloco que sempre aparece (independente do perfil escolhido)
    info += `
####################### DESPROVISIONAR #######################


onu delete ${slot}/${onu}
-------
Ok to delete ONU ${slot}/${onu} and all of its configuration? [yes] or [no]:    yes
Do you want to exit from this request? [yes] or [no]:    no
Are you sure? [yes] or [no]:   yes
-------

`;
                break;






        case "ZTE":
                info = `####################### COMANDOS ZTE #######################

Buscar ONU
show gpon onu by sn ${serial}

Verifica se pegou IP
show gpon remote-onu wan-ip gpon_onu-1/${slot}:${onu}

Verificar sinal da fibra
show pon power attenuation gpon_onu-1/${slot}:${onu}

Validar status da ONU
show gpon onu detail-info gpon_onu-1/${slot}:${onu}

`;

    if (rede === "ROUTER") {
        info += 
`Desprovisionadas 
show pon onu uncfg

Listar ONUs
show gpon onu baseinfo gpon_olt-1/${slot}

Listar Status da ONUs 
show gpon onu state gpon_olt-1/${slot}

####################### PROVISONAMENTO ZTE #######################

enable
senha: zxr10

configure terminal
interface gpon_olt-1/${slot}
no shutdown
onu ${onu} type OTP-GPON sn ${serial}
bind-onu ${onu} profile line LP-HSI_TV_PH_PPPoE_GPON
bind-onu ${onu} profile service SP-HSI_TV_PH_PPPoE_GPON	
exit
interface vport-1/${slot}.${onu}:1
service-port 1 user-vlan 401 vlan 401 ingress vel_2000M_2000M_IN egress vel_2000M_2000M_OUT
exit
pon-onu-mng gpon_onu-1/${slot1}:${onu}
mvlan tag eth_0/1 strip
mvlan tag eth_0/2 strip
mvlan tag eth_0/3 strip
mvlan tag eth_0/4 strip
wan-ip ipv4 mode pppoe username ${service_port} password ${vlan} vlan-profile VP-PPPoE host 1

####################### DESPROVISIONAR #######################

enable
configure terminal
interface gpon_olt-1/${slot}
no onu ${onu}
exit
`;
    } else if (rede === "BRIGDE") {
        info += 
`Desprovisionadas 
show pon onu uncfg

Listar ONUs
show gpon onu baseinfo gpon_olt-1/${slot}

Listar Status da ONUs 
show gpon onu state gpon_olt-1/${slot}

####################### PROVISONAMENTO ZTE #######################

enable
senha: zxr10

configure terminal
interface gpon_olt-1/${slot}
onu ${onu} type BRIDGE sn ${serial} vport-mode gemport
exit
interface gpon_onu-1/${slot}:${onu}
tcont 1 profile 1G
gemport 1 tcont 1
exit
interface vport-1/${slot}.${onu}:1
service-port 1 user-vlan ${service_port} vlan ${service_port}
exit
pon-onu-mng gpon_onu-1/${slot}:${onu}
service 1 gemport 1 vlan ${service_port}
vlan port eth_0/1 mode tag vlan ${service_port}
exit

####################### DESPROVISIONAR #######################

enable
configure terminal
interface gpon_olt-1/${slot}
no onu ${onu}
exit
`;
    } else if (rede === "RAMAL") {
        info += 
`Confirmar se registrou o ramal
show gpon remote-onu voip-linestatus gpon_onu-1/1/${slot2}:${onu}

Confirmar se subiu IP na VLAN 298
show gpon remote-onu voip-ip gpon_onu-1/1/${slot2}:${onu}

####################### CONFIGURAR RAMAL #######################

configure terminal
interface vport-1/1/${slot2}.${onu}:1
service-port 2 user-vlan 298 vlan 298
exit
pon-onu-mng gpon_onu-1/1/${slot2}:${onu}

sip-service pots_0/1 profile VP-SIP01 userid ${service_port} username ${service_port} password ${vlan} media-profile VP-MEDIA01
exit

####################### CONFIGURAR CFTV #######################

conf t
interface gpon_olt-1/${slot}
onu ${onu} type OTP-GPON sn ${serial}	
bind-onu ${onu} profile line LP-L2L_SI_GPON
bind-onu ${onu} profile service SP-L2L_SI_GPON
exit
interface vport-1/${slot}.${onu}:1
service-port 1 user-vlan 501 vlan 501
exit

####################### REMOVER VOIP #######################

configure terminal
pon-onu-mng gpon_onu-1/${slot}:${onu}
no sip-service pots_0/1
`;

    }
                break;

            case "OUTROS":
                info = `
####################### COMANDOS #######################

Validar se rota está operacional
display interface description | include ${serial}


Validar sinal
HUAWEI

display optical-module extend information interface GigabitEthernet 0/${slot}

display transceiver diagnosis interface XGigabitEthernet 0/${slot}

display transceiver interface XGigabitEthernet 0/${slot} verbose

display interface XGigabitEthernet 0/${slot}


NOKIA
show port 1/${slot} optical


JUNIPER
show interfaces diagnostics optics et-0/${slot} | match laser


EXTREME
show ports 47 transceiver information detail


DATACOM
show hardware-status transceivers detail ${slot}

`;
         break;


        }

conteudo.value = info;
    } else if (provedor) {
        conteudo.innerHTML = `<h2>${provedor}</h2><p>Selecione a rede para ver os comandos.</p>`;
    } else {
        conteudo.innerHTML = "<h2>Selecione um comando</h2><p>O conteúdo aparecerá aqui quando você escolher provedor e rede.</p>";
    }
}
