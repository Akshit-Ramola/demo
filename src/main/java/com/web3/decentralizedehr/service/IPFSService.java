package com.web3.decentralizedehr.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Map;

@Service
public class IPFSService {

    @Value("${pinata.api.key}")
    private String pinataApiKey;

    @Value("${pinata.secret.api.key}")
    private String pinataSecretApiKey;
    
    // In production, fetch this dynamically or from a secure vault (must be 32 bytes for AES-256)
    @Value("${aes.secret.key:12345678901234567890123456789012}") 
    private String aesSecretKey;
    
    private final WebClient webClient = WebClient.builder().baseUrl("https://api.pinata.cloud").build();

    public String encryptAndUpload(MultipartFile file) throws Exception {
        // 1. Read file bytes
        byte[] fileBytes = file.getBytes();
        
        // 2. Encrypt using AES-256
        byte[] encryptedBytes = encryptAES(fileBytes);
        
        // 3. Upload encypted binary to IPFS via Pinata API
        return uploadToPinata(encryptedBytes, file.getOriginalFilename() + ".enc");
    }

    private byte[] encryptAES(byte[] data) throws Exception {
        Key key = new SecretKeySpec(aesSecretKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(data);
    }
    
    private String uploadToPinata(byte[] fileBytes, String filename) {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        
        // Wrap bytes in ByteArrayResource so WebClient handles it as a file part
        body.add("file", new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return filename;
            }
        });

        // Push to Pinata and retrieve IPFS Hash
        Map response = webClient.post()
                .uri("/pinning/pinFileToIPFS")
                .header("pinata_api_key", pinataApiKey)
                .header("pinata_secret_api_key", pinataSecretApiKey)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
                
        return (String) response.get("IpfsHash");
    }
}
