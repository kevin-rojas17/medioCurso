# DOCKER GUIDE
Para correr Docker con todas la solucion
```bash
docker-compose up --build
```
Para crear pruebas  del API en Postman:
```js
pm.test("Estado 200 OK Al listar", function(){
    pm.response.to.have.status(200);
});
pm.test("Retorna una lista de empresas", function(){
    pm.expect(pm.response.json()).to.be.an('array');
});
pm.test("La longitud de la respuesta debe ser mayor que cero", function () {
    const responseData = pm.response.json();
    pm.expect(responseData.length).to.be.greaterThan(0, "La lista de empresas no debe estar vacía");
});
```
# KUBERNETES GUIDE

Despliegue de microservicios en Kubernetes AWS.
--------------
1. Tener cuenta AWS.
2. Instalar AWS-CLI.
3. tener una clave de acceso de tu usuario.
4. Enlazar mi usuario de AWS con el CLI de mi maquina.
```bash
aws configure
```
4. Crear un repositorio de contenedores en AWS Elastik Container Registry.
5. Crear un cluster en AWS Elastic Kubernetes Service
Ejemplo:cluster01. vpc:vpc-a60a53dd
6. Crear un grupo de nodos dentro del cluster.
* p6.Autenticar en ECR
```bash
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 710473750744.dkr.ecr.us-east-2.amazonaws.com
```
* p7. Crear la imagen de Docker en el repo:
```bash
docker tag integracion_aplicaciones-person_api:latest 710473750744.dkr.ecr.us-east-2.amazonaws.com/prestamosms:latest
```
* p8. subir la imagen al ECR
```bash
docker push 710473750744.dkr.ecr.us-east-2.amazonaws.com/integracion_aplicaciones-person_api:latest
docker push 710473750744.dkr.ecr.us-east-2.amazonaws.com/prestamos:latest
```
* p9. Crear Nodos en el Cluster.
* p10. Conexión con el contexto de mi kubernetes con el cluster en AWS.
```bash
aws eks --region us-east-2 update-kubeconfig --name LoanCluster
kubectl get all 
```
* p11. Crear un archivo deployment.yml con la configuración de despliegue.
* p12. Crear mi infra k8s:
```bash
$ kubectl create -f ./deployment.yml
$ kubectrl get pods
$ kubectrl get deployments
```

* p13. Verificar la aplicacion por la url del Browser
https://ace066e10cbdc446c90c4bed0b0ae4b2-1082294916.us-east-2.elb.amazonaws.com

* p14 si haces algun cambio en las imagenes, para actualizar:
```bash
$ kubectl apply -f ./deployment.yml
```
* p15 Para borrar recursos:
```bash
$ kubectl delete -f ./deployment.yml
```